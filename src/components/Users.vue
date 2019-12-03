<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input
      placeholder="请输入内容"
      v-model="query"
      class="input-with-select"
    >
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="search"
      ></el-button>
    </el-input>
    <el-button
      type="success"
      plain
      @click="showAddDialog"
    >用户添加</el-button>
    <!-- 表格组件 -->
    <el-table
      :data="userList"
      style="width: 100%"
    >
      <el-table-column
        prop="username"
        label="姓名"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="mg_state"
        label="状态"
        width="180"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
            @click="showEditDialog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delUser(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="small"
            @click="showAssignDialog(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[2,4,6,8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="70px"
        :rules="rules"
        status-icon
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="70px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="用户名">
          <el-tag type="info">{{editForm.username}}</el-tag>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="assignRolerDialogVisible"
    >
      <el-form :model="rolerData">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            disabled
            v-model="rolerData.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色列表"
          :label-width="formLabelWidth"
        >
          <!--
          下拉选择框

          label 表示：使用数据中的哪个属性来表示展示的文字内容
          value 表示：表示每一项的值，一般就是id
          v-model 表示：选中 option 的value值，也是id值
            只要 v-model 与 el-option 的value属性值相同，那么这一项就会默认选中
        -->
          <el-select
            v-model="rolerData.rid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>

          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="assignRolerDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignRoler"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      current: 1,
      pageSize: 2,
      total: 0,
      userList: [],
      addDialogVisible: false, // 控制添加的对话框是否显示
      // 收集添加用户的数据
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },

      // 分配用户角色数据
      assignRolerDialogVisible: false,
      rolerData: {
        id: -1, // 用户的id
        username: "", // 用户的用户名
        rid: -1 // 用户的角色id
      },
      options: [], // 存放角色列表的
      formLabelWidth: "120px",

      // 表单校验规则 1 2
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "change" },
          { min: 3, max: 9, message: "用户名长度为3-9位", trigger: "change" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "change" },
          { min: 6, max: 12, message: "密码长度为6-12位", trigger: "change" }
        ],
        email: [
          { type: "email", message: "请输入正确的邮箱格式", trigger: "change" }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "change"
          }
        ]
      },
      editDialogVisible: false, // 控制修改对话框显示
      editForm: {}
    };
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        url: "users",
        method: "get",
        params: {
          query: this.query,
          pagenum: this.current,
          pagesize: this.pageSize
        }
      });

      let {
        meta: { status },
        data: { users, total }
      } = res.data;
      if (status === 200) {
        this.userList = users;
        this.total = total;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.current = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getUserList();
    },
    search() {
      // 搜索的时候，让当前页变成1
      this.current = 1;
      this.getUserList();
    },
    // 改变状态
    async changeState(row) {
      let res = await this.axios({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: "put"
      });
      let {
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.$message.success("修改状态成功了");
      } else {
        this.$message.error("修改状态失败了");
      }
    },
    // 删除用户
    async delUser(row) {
      try {
        await this.$confirm("亲，你确定要删除这个用户吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // 发送axios请求删除用户
        let res = await this.axios.delete(`users/${row.id}`);
        let {
          meta: { status }
        } = res.data;
        if (status === 200) {
          this.$message.success("恭喜你，删除用户成功了");
          // 重新渲染
          if (this.userList.length === 1 && this.current > 1) this.current--;
          this.getUserList();
        } else {
          this.$message.danger("删除用户失败");
        }
      } catch (e) {
        this.$message.error("取消删除了");
      }
    },
    // 显示添加用户模态框
    showAddDialog() {
      // 显示添加用户对话框
      this.addDialogVisible = true;
    },
    // 添加用户
    addUser() {
      // 1.校验表单
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          let res = await this.axios.post(`users`, this.addForm);
          let {
            meta: { status }
          } = res.data;
          if (status === 201) {
            this.$message.success("恭喜你，添加用户成功了");
            // 清空表单的内容
            this.$refs.addForm.resetFields();
            // 关闭模态框
            this.addDialogVisible = false;
            // 重新渲染
            // 求最大的页码
            this.total++;
            this.current = Math.ceil(this.total / this.pageSize);
            this.getUserList();
          } else {
            this.$message.error("添加用户失败了");
          }
        } else {
          return false;
        }
      });
    },
    // 显示修改对话框
    showEditDialog(row) {
      this.editDialogVisible = true;
      this.editForm = row;
    },
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          // 发送ajax请求
          let res = await this.axios.put(`users/${this.editForm.id}`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          });
          let {
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.editDialogVisible = false;
            this.$refs.editForm.resetFields();
            this.getUserList();
            this.$message.success("恭喜你，用户修改成功了");
          } else {
            this.$message.error("很遗憾，用户修改失败了");
          }
        } else {
          return false;
        }
      });
    },
    async showAssignDialog(roles) {
      this.assignRolerDialogVisible = true;
      // 获取用户角色相关数据回显
      this.rolerData.id = roles.id;
      this.rolerData.username = roles.username;

      // 回显rid
      // 发送ajax请求，获取用户的角色id
      const res = await this.axios.get(`users/${roles.id}`);
      // console.log(res);
      const {
        meta: { status },
        data
      } = res.data;
      if (status === 200) {
        this.rolerData.rid = data.rid;
        // 没有角色情况下，进行特殊处理，什么不选中
        if (data.rid === -1) {
          this.rolerData.rid = "";
        }
      }
    },
    // 获取角色列表
    async getRoleList() {
      // 获取角色列表的信息
      let res = await this.axios.get(`roles`);
      let {
        meta: { status },
        data
      } = res.data;
      // console.log(data);
      if (status === 200) {
        this.options = data;
      }
    }
  },

  created() {
    this.getRoleList();
    this.getUserList();
  }
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 300px;
  margin-bottom: 5px;
}
</style>
