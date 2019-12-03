<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button
      type="success"
      plain
      @click="showAddDialog"
    >添加角色</el-button>
    <el-table
      :data="roleList"
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-if="scope.row.children.length === 0">
            <span>暂无权限</span>
          </el-row>
          <!-- 1级权限 -->
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id"
          >
            <el-col :span="4">
              <el-tag
                closable
                @close="delRight(scope.row, level1.id)"
              >{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <!-- 2级权限 -->
              <el-row
                class="level2"
                v-for="level2 in level1.children"
                :key="level2.id"
              >
                <el-col :span="4">
                  <el-tag
                    @close="delRight(scope.row, level2.id)"
                    closable
                    type="success"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级 -->
                  <el-tag
                    @close="delRight(scope.row, level3.id)"
                    class="level3"
                    closable
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    type="danger"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
      ></el-table-column>
      <el-table-column
        prop="roleDesc"
        label="描述"
      ></el-table-column>
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
            @click="delRole(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="small"
            @click="showAssignDialog(scope.row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="rules"
        status-icon
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="40%"
    >
      <!-- 表单 -->
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="80px"
        :rules="rules"
        status-icon
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignDialogVisible"
      width="40%"
    >

      <!-- 树形组件：el-tree -->
      <!-- show-checkbox: 显示复选框 -->
      <!-- default-expand-all：默认展开所有 -->
      <el-tree
        :data="rightList"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      >
      </el-tree>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="assignDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="assignRight"
        >分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  /*eslint-disable*/
  data() {
    return {
      roleList: [],
      addDialogVisible: false,
      addForm: {
        roleName: "",
        roleDesc: ""
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色的名称", trigger: "change" }
        ]
      },
      editDialogVisible: false,
      editForm: {
        roleName: "",
        roleDesc: ""
      },
      assignDialogVisible: false,
      // 默认的属性
      defaultProps: {
        // 指定如何查找子节点的内容
        children: "children",
        // 指定标签显示哪个属性的
        label: "authName"
      },
      roleId: "",
      rightList: [] // 存放所有的权限列表
    };
  },
  methods: {
    async getRoleList() {
      // 获取所有的角色列表
      let res = await this.axios.get("roles");
      let {
        meta: { status },
        data
      } = res.data;
      if (status === 200) {
        this.roleList = data;
        console.log(this.roleList);
      }
    },
    async delRole(row) {
      try {
        // 警告框
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // 确定
        let res = await this.axios.delete(`roles/${row.id}`);
        let {
          meta: { status }
        } = res.data;
        if (status === 200) {
          // 提示
          this.$message.success("恭喜你，删除角色成功了");
          // 重新获取角色列表
          this.getRoleList();
        } else {
          this.$message.error("删除角色失败了");
        }
      } catch (e) {
        this.$message.error("取消删除");
      }
    },
    showAddDialog() {
      this.addDialogVisible = true;
    },
    async addRole() {
      let res = await this.axios.post(`roles`, this.addForm);
      let {
        meta: { status }
      } = res.data;
      if (status === 201) {
        // 关闭对话框
        this.addDialogVisible = false;
        // 清空里面的内容
        this.$refs.addForm.resetFields();
        // 重新渲染
        this.getRoleList();
        // 给消息提示
        this.$message.success("恭喜你，添加角色成功了");
      } else {
        this.$message.error("很抱歉，添加角色失败了");
      }
    },
    showEditDialog(row) {
      this.editDialogVisible = true;
      this.editForm = row;
    },
    async editRole() {
      let res = await this.axios.put(
        `roles/${this.editForm.id}`,
        this.editForm
      );
      let {
        meta: { status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.editDialogVisible = false;
        // 清空里面的内容
        this.$refs.editForm.resetFields();
        // 重新渲染
        this.getRoleList();
        // 给消息提示
        this.$message.success("恭喜你，修改角色成功了");
      } else {
        this.$message.error("很抱歉，修改角色失败了");
      }
    },
    // 删除角色指定的权限
    async delRight(row, rightId) {
      // 直接发送ajax请求
      let res = await this.axios.delete(`roles/${row.id}/rights/${rightId}`);
      // 返回的data是当前角色删除后的权限
      let {
        meta: { status },
        data
      } = res.data;
      if (status === 200) {
        // 删除功能
        this.$message.success("删除成功");
        // 重新渲染当前角色的权限
        row.children = data;
      } else {
        this.$message.error("删除失败");
      }
    },
    // 显示分配权限的对话框
    async showAssignDialog(row) {
      this.assignDialogVisible = true;
      this.roleId = row.id;
      // 发送ajax请求，获取所有的权限，树形结构
      let res = await this.axios.get(`rights/tree`);
      let {
        meta: { status },
        data
      } = res.data;
      if (status === 200) {
        this.rightList = data;
      }
      // 设置默认选中
      // 获取到当前角色拥有的所有的三级权限的id
      let temp = [];
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            // 使用一个空数组，把所有的三级权限的id给存储起来
            temp.push(level3.id);
          });
        });
      });

      this.$refs.tree.setCheckedKeys(temp);
    },
    // 分配权限
    async assignRight() {
      // 角色id，权限列表
      let keys = this.$refs.tree.getCheckedKeys();
      let halfKeys = this.$refs.tree.getHalfCheckedKeys();
      // let rids = keys.concat(halfKeys).join();
      let rids = [...keys, ...halfKeys].join();
      // 发送axios请求
      let res = await this.axios.post(`roles/${this.roleId}/rights`, { rids });
      let {
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.assignDialogVisible = false;
        // 给一个提示消息
        this.$message.success("恭喜你，分配角色成功了！");
        //重新渲染
        this.getRoleList();
      }
    }
  },
  created() {
    this.getRoleList();
  }
};
</script>

<style lang="less" scoped>
.level2 {
  margin-bottom: 10px;
}

.level3 {
  margin-right: 10px;
  margin-bottom: 5px;
}
</style>
