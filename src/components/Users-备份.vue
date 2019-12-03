<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success" plain>用户添加</el-button>
    <!-- 表格:el-table -->
    <!-- data: 表格显示的数据 -->
    <!-- el-table-column: 表格的一列 -->
    <!-- prop: 对应列内容的字段名-->
    <!-- label: 表头的描述信息 -->
    <el-table
      :data="userList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="200">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="200">
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="200">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <!-- 如果想要自己定义表格某一列显示的内容 -->
        <template slot-scope="scope">
           <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small">
           </el-button>
           <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small">
           </el-button>
           <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="small">
            分配角色
           </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <!-- background:背景颜色 -->
    <!-- total：总条数 -->
    <!-- page-size：每页的条数 -->
    <!-- layout: 用于控制分页的内容 -->
    <!-- page-sizes:指定每页显示的条数 -->
    <!-- current-page:指定当前页 -->
    <el-pagination
      background
      layout="total,sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[2, 4, 6, 8, 10]"
      :current-page="current"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>

<script>
// 引入axios
import axios from 'axios'
export default {
  data() {
    return {
      query: '', // 查询的关键字
      current: 1, // 当前页
      pageSize: 2, // 每页显示的条数
      total: 0, // 总的条数
      userList: [] // 存储用户的列表
    }
  },
  methods: {
    // 用于获取用户列表数据
    getUserList() {
      axios({
        url: 'http://localhost:8888/api/private/v1/users',
        method: 'get',
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    // 修改当前页
    handleCurrentChange(val) {
      // 修改当前页
      this.current = val
      // 需要重新发送ajax请求
      this.getUserList()
    },
    // 修改每页显示的条数
    handleSizeChange(val) {
      // 修改pageSize
      this.pageSize = val
      // 修改当前页为第一页
      this.current = 1
      // 重新获取
      this.getUserList()
    },
    // 搜索功能
    search() {
      // 重新获取内容
      this.getUserList()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 30px;
  line-height: 30px;
}
.el-input {
  width: 300px;
  margin-bottom: 5px;
}
</style>
