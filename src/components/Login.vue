<template>
  <div class="login">
    <!-- el-form: 表单组件 -->
    <!-- :model 表单的数据 -->
    <!-- label-width： label的宽度 -->
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" alt="">
      <el-form-item label="用户名" prop="username">
        <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
       <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" placeholder="请输入密码" type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
    },
    login() {
      // 调用了form组件的validate方法
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          let res = await this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          })
          if (res.data.meta.status === 200) {
            // 登录成功, 跳到首页组件
            this.$message.success('登录成功')
            // 把返回的token存储起来
            // 坑：需要先保存token，才能跳转
            localStorage.setItem('token', res.data.data.token)
            this.$router.push('/home')
          } else {
            // 登录失败
            this.$message.error('用户名或者密码错误')
            // console.log('用户名或者密码错误')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }

    .el-button + .el-button {
      margin-left: 80px;
    }
  }
}
</style>
