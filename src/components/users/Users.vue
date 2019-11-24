<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb
      class="breadcrumb"
      separator-class="el-icon-arrow-right"
    >
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>
    <!-- 搜索栏 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          v-model="queryStr"
          ref="searchData"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="queryUserList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button
          class="addUser"
          @click="showUserAddDialog"
          type="success"
          plain
        >添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表信息显示 -->
    <el-table
      :data="userList"
      :stripe="true"
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
      <el-table-column label="用户状态">
        <!-- scope.row 表示当前行的数据 -->
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeUserState(scope.row.id,scope.row.mg_state)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="mini"
            @click="showUserEditDailog(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            @click="delUserById(scope.row.id)"
          ></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="mini"
            @click="showUserAssignDialog(scope.row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      class="pagePlace"
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="curPage"
      @current-change="changePage"
    >
    </el-pagination>

    <!-- 编辑弹出对话框 -->
    <el-dialog
      class="elDialog"
      title="编辑用户"
      :visible.sync="userEditDialog"
      @close="closeUserEditDialog"
    >
      <el-form
        :model="userEditForm"
        :rules="userEditRules"
        ref="userEditForm"
      >
        <el-form-item
          porp="username"
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            disabled
            v-model="userEditForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userEditForm.email"></el-input>
        </el-form-item>
        <el-form-item
          prop="mobile"
          label="手机"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userEditForm.mobile"></el-input>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="userEditDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editUser"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加用户对话框 -->
    <el-dialog
      class="elDialog"
      title="添加用户"
      :visible.sync=" userAddDialog"
      @close="closeUserAddDialog"
    >
      <el-form
        :model="userAddForm"
        :rules="userAddRules"
        ref="userAddForm"
      >
        <el-form-item
          label="用户名"
          prop="username"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userAddForm.username"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="userAddForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="email"
          label="邮箱"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userAddForm.email"></el-input>
        </el-form-item>
        <el-form-item
          prop="mobile"
          label="手机"
          :label-width="formLabelWidth"
        >
          <el-input v-model="userAddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="userAddDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      class="elDialog"
      title="分配角色"
      :visible.sync="showRolersDialog"
    >
      <el-form :model="userAssignForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input
            disabled
            v-model="userAssignForm.username"
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
            v-model="userAssignForm.roleId"
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in rolesList"
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
        <el-button @click="showRolersDialog = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignRolersToUser"
        >确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
    // 获取角色列表
    this.getRoleList();
  },
  data() {
    return {
      userList: [],
      // 每页大小
      pageSize: 3,
      // 当前页码
      curPage: 1,
      // 总条数
      total: 0,
      // 搜索内容
      queryStr: "",

      // 控制编辑用户对话框的展示和隐藏
      userEditDialog: false,
      userEditForm: {
        id: -1,
        username: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "120px",
      userEditRules: {
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            // 如果需要在值改变或者失去焦点的时候，都触发验证，可以传递两个
            // trigger: 'change, blur'

            // 当前值改变，就会触发
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ]
      },

      // 添加用户对话框数据
      userAddDialog: false,
      userAddForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userAddRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 12, message: "长度在 4 到 12 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [
          {
            pattern: /^\w+@[a-z0-9]+\.[a-z]{2,4}$/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            // 如果需要在值改变或者失去焦点的时候，都触发验证，可以传递两个
            // trigger: 'change, blur'

            // 当前值改变，就会触发
            trigger: "change"
          }
        ]
      },

      // 用户角色对话框数据
      showRolersDialog: false,
      userAssignForm: {
        // 用户id
        userId: -1,
        // 用户角色id
        roleId: -1,
        // 用户名
        username: ""
      },
      formLabelWidth: "120px",
      rolesList: []
    };
  },
  methods: {
    // 添加用户数据列表
    async getUserList(curPage = 1) {
      const res = await this.$http.get("/users", {
        params: {
          pagenum: curPage,
          pagesize: 3,
          query: this.queryStr || ""
        }
      });
      console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        //获取数据成功
        this.userList = data.users;
        this.total = data.total;
        this.curPage = data.pagenum;
      }
    },
    // 启用或禁用用户
    async changeUserState(id, curState) {
      // console.log(id, curState);
      const res = await this.$http.put(`/users/${id}/state/${curState}`);
      // console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.$message({
          type: "success",
          message: data.mg_state === 0 ? "禁用成功" : "启用成功",
          duration: 1000
        });
      } else {
        this.$message({
          type: "error",
          message: meta.msg,
          duration: 1000
        });
      }
    },

    showUserEditDailog(curUser) {
      // console.log(curUser);
      // 先获取到当前用户的数据
      // 数据交给 userEditForm 后，就会展示在编辑对话框中
      for (const key in this.userEditForm) {
        this.userEditForm[key] = curUser[key];
      }
      //打开用户编辑对话框
      this.userEditDialog = true;
    },

    /**
     * 分页获取数据
     * 参数 cruPage 表示当前点击的页码
     */
    changePage(curentPage) {
      // console.log("当前页为：", curentPage);
      this.getUserList(curentPage);
    },

    /**
     * 点击确认按钮提交用户更新数据
     * 重新渲染页面
     */
    editUser() {
      this.$refs.userEditForm.validate(valid => {
        if (valid) {
          const { id, email, mobile } = this.userEditForm;
          this.$http
            .put(`/users/${id}`, {
              email,
              mobile
            })
            .then(res => {
              const { data, meta } = res.data;
              if (meta.status === 200) {
                // 更新该用户数据
                const editUsers = this.userList.find(item => item.id === id);
                // 双向数据绑定，只要有数据发生变化，就会重新渲染页面
                editUsers.email = data.email;
                editUsers.mobile = data.mobile;
                // 关闭对话框
                this.userEditDialog = false;
              }
            });
        } else {
          // console.log('表单验证失败')
          return false;
        }
      });
    },

    // 搜索用户信息
    queryUserList() {
      this.curPage = 1;
      this.getUserList();
    },

    /**
     * 点击添加用户按钮
     * 弹出对话框
     */
    showUserAddDialog() {
      this.userAddDialog = true;
    },

    /**
     * 点击确认按钮发送请求添加用户数据
     * 刷新页面
     */
    addUser() {
      this.$refs.userAddForm.validate(valid => {
        if (valid) {
          // 成功
          // console.log("验证成功");
          this.$http.post("/users", this.userAddForm).then(res => {
            const { meta } = res.data;
            if (meta.status === 201) {
              // 1 关闭对话框
              // 2 重置表单(只要关闭对话框，就会自动触发对话框的关闭事件来重置表单)
              this.userAddDialog = false;

              // 重新获取列表数据
              this.total += 1;
              const lastPage = Math.ceil(this.total / this.pageSize);
              // this.getUserList(lastPage);
              this.curPage = lastPage;
              this.changePage(lastPage);
            }
          });
        }
      });
    },

    // 关闭对话框重置表单
    closeUserAddDialog() {
      this.$refs.userAddForm.resetFields();
    },

    // 删除用户信息
    delUserById(id) {
      // 弹出消息提示框是否确认删除
      this.$confirm("确定删除该用户吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then(res => {
            const { meta } = res.data;
            if (meta.status === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              const index = this.userList.findIndex(item => item.id === id);
              this.userList.splice(index, 1);
              if (this.userList.length === 0) {
                this.getUserList(--this.curPage);
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 点击分配角色弹出分配角色对话框
    async showUserAssignDialog(curRolers) {
      this.showRolersDialog = true;
      // console.log(curRolers);
      const { id, username, role_name } = curRolers;
      // 给分配角色数据赋值
      this.userAssignForm.username = username;
      // 暂存用户id
      this.userAssignForm.userId = id;
      // 选择默认角色
      // 根据当前用户的id，获取角色id
      const res = await this.$http.get(`users/${id}`);
      // console.log(res);
      const { meta, data } = res.data;
      if (meta.status === 200) {
        // 设置当前用户具有的角色id
        // console.log(data.rid);
        this.userAssignForm.roleId = data.rid;

        // 没有角色的情况下，进行特殊处理，什么不选中
        if (data.rid === -1) {
          this.userAssignForm.roleId = "";
        }
      }
    },

    // 获取角色列表
    async getRoleList() {
      const res = await this.$http.get("/roles");
      // console.log(res);
      const { meta, data } = res.data;
      if (meta.status === 200) {
        this.rolesList = data;
        console.log(data);
      }
    },

    // 点击确定按钮，给用户分配新的角色
    async assignRolersToUser() {
      // 拿到用户id，和用户角色id
      const { userId, roleId } = this.userAssignForm;

      // 发送请求更新数据
      const res = await this.$http.put(`users/${userId}/role`, { rid: roleId });

      const { meta } = res.data;
      if (meta.status === 200) {
        // 关闭对话框
        this.showRolersDialog = false;
        // 重新刷新列表
        this.getUserList(this.curPage);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.pagePlace {
  text-align: left;
}
.elDialog {
  text-align: left;
}
.addUser {
  float: left;
}
.breadcrumb {
  height: 40px;
  line-height: 40px;
  background-color: #d4dae0;
  font-size: 16px;
  padding-left: 10px;
}
</style>
