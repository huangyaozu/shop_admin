<template>
  <div class="login-wrapper">
    <el-row type="flex" class="loginForm" justify="center">
      <el-col class="login-col" :xs="12" :sm="10" :md="8" :lg="6" :xl="4">
        <el-form
          class="login-content"
          label-position="top"
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 导入axios
import axios from "axios";
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 发送请求验证登录
    login() {
      // 使用axios发送请求
      axios
        .post("http://localhost:8888/api/private/v1/login", this.loginForm)
        .then(res => {
          console.log(res);
          const { data, meta } = res.data;
          if (meta.status === 200) {
            // 将token值存储在浏览器中
            localStorage.setItem("token", data.token);
            // 登陆成功跳转到首页
            this.$router.push("/home");
          } else {
            this.$message({
              type: "error",
              message: meta.msg,
              duration: 1000
            });
          }
        });
    },

    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 成功：调用登录接口
          this.login();
          // console.log("登录成功");
        } else {
          // 校验失败
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.loginForm.resetFields();
    }
  }
};
</script>

<style>
.login-wrapper,
.loginForm {
  height: 100%;
}

.loginForm {
  background-color: #2d434c;
}
.login-col {
  margin: auto;
}
.login-content {
  min-width: 240px;
  padding: 20px 35px;
  border-radius: 10px;
  background-color: #fff;
}
</style>
