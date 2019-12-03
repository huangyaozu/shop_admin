<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        <span>欢迎光临</span>
        <a
          href="javascript:;"
          @click="logout"
        >退出</a>
      </div>
      <div class="title">
        <h3>电商后台管理系统</h3>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <!-- el-menu: 导航组件 -->
        <!-- default-active：当前激活菜单的 index -->
        <!-- el-submenu：子导航 -->
        <!-- el-menu-item-group：分组 -->
        <!-- el-menu-item： 每一项的菜单 -->
        <!-- router：开启vue-router模式， 点击菜单跳路由 -->
        <el-menu
          :router="true"
          :unique-opened="true"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >

          <!-- 子菜单 ： 一级菜单 -->
          <el-submenu
            :index=" '/' + menu1.path "
            v-for="menu1 in menuList"
            :key="menu1.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ menu1.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + menu2.path"
              v-for="menu2 in menu1.children"
              :key="menu2.id"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ menu2.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <!-- 指定home组件中的子组件的出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: []
    };
  },
  created() {
    // 获取菜单
    this.getMenuList();
  },
  methods: {
    // 加载左侧菜单
    async getMenuList() {
      const res = await this.axios.get(`/menus`);

      // console.log(res)
      const { meta, data } = res.data;
      if (meta.status === 200) {
        this.menuList = data;
        // console.log(this.$route.path);
        // console.log(this.menuList);
      }
    },

    async logout() {
      // 弹出消息框
      try {
        await this.$confirm("你确定要退出吗?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // 清除本地的token
        localStorage.removeItem("token");
        // 跳转到登录页
        this.$router.push("/login");
        this.$message.success("退出成功");
      } catch (e) {
        this.$message.info("退出取消");
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="less" scoped>
// 样式只会在当前组件生效
.home {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    .logo {
      width: 180px;
      height: 60px;
      background: url("../assets/logo.png") no-repeat center center;
      background-size: contain;
      float: left;
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      font-weight: 700;
      line-height: 60px;
      text-align: right;
      a {
        color: #f80;
      }
    }
    .title {
      overflow: hidden;
      height: 60px;
      line-height: 60px;
      text-align: center;
      color: #fff;
      font-size: 24px;
    }
  }
  .el-aside {
    background-color: rgb(84, 92, 100);

    .el-submenu {
      width: 200px;
    }
  }

  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
