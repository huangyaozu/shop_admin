<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col
          :span="8"
          class="logo"
        >
          <img
            src="@/assets/logo.png"
            alt="黑马logo"
          />
        </el-col>
        <el-col :span="8">
          <h1 class="title">电商后台管理系统</h1>
        </el-col>
        <el-col :span="8">
          <div class="wellcome">
            <span>欢迎来到乐团管理系统</span>
            <a
              href="javascript:;"
              @click.prevent="logout"
            >退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside
        class="home-aside"
        width="200px"
      >
        <!-- el-menu 表示菜单组件
       default-active 当前激活菜单的 index 值
        @open 菜单展开事件
        @close 菜单收起事件
        -->
        <el-menu
          :default-active="location"
          :router="true"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <!-- 启用路由模式后，index就相当于 原来 router-link 中的to属性，用来指定导航的路径（哈希值） -->
            <!-- 可以使用 /home/users 或者 home/users -->
            <el-menu-item index="/home/users">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>用户列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/home/roles">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>角色列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/home/rights">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>权限列表</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.location = location.hash.split("#")[1];
  },

  data() {
    return {
      location: ""
    };
  },
  methods: {
    // 退出功能
    logout() {
      this.$confirm("您是否确认退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        localStorage.removeItem("token");
        // 跳回登录页面
        this.$router.push("/login");
        // this.$message({
        //   type: "success",
        //   message: "删除成功!"
      });
    },

    handleOpen(key, keyPath) {
      console.log("open", key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log("close", key, keyPath);
    }
  }
};
</script>

<style scoped lang="less">
.el-header {
  height: 60px;
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  // text-align: center;
  height: 100%;
}

.home-aside {
  background-color: #545c64;
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}
.el-container {
  /* margin-bottom: 40px; */
  height: 100%;
}

/* 头部样式 */
.logo {
  text-align: left;
}
.title {
  margin: 0;
  line-height: 60px;
  text-align: center;
  font-size: 35px;
  color: #fff;
}
.wellcome {
  line-height: 60px;
  font-weight: bold;
  text-align: right;
  padding-right: 30px;

  a {
    color: #b07a17;
    text-decoration: none;
  }
}
</style>
