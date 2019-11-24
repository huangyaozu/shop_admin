export default {
  created() {
    this.getRolesList();
    this.getAllRightTree();
  },
  data() {
    return {
      // 角色数据列表
      rolesList: [],

      // 角色编辑对话框数据
      dialogFormVisible: false,
      rolesdata: {
        id: "",
        roleName: "",
        roleDesc: ""
      },
      formLabelWidth: "120px",

      // 权限分配对话框数据
      assignRightDialog: false,
      rightsTree: [],
      defaultProps: {
        // children 用来指定使用哪个属性来指定子节点
        children: "children",
        // label 用来指定使用数据中的哪个属性展示树形控制中每个节点的名字
        label: "authName"
      },
      // 当前分配权限的角色id
      curRoleId: -1
    };
  },

  methods: {
    // 设置索引排序规则
    indexMethod(index) {
      return index;
    },
    // 获取角色列表数据
    async getRolesList() {
      const res = await this.$http.get("/roles");
      console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.rolesList = data;
      }
    },

    /**
     * 获取到所有的权限树形结构数据
     */
    async getAllRightTree() {
      const res = await this.$http.get("/rights/tree");
      // console.log(res);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.rightsTree = data;
      }
    },

    // 按编辑按钮，编辑角色对话框显示
    showRolesEditDailog(curRolers) {
      this.dialogFormVisible = true;
      // console.log(curRolers);
      for (const key in this.rolesdata) {
        this.rolesdata[key] = curRolers[key];
      }
    },

    // 点击确定按钮，修改用户角色信息,并渲染到页面
    async updateRolers() {
      const { id, roleName, roleDesc } = this.rolesdata;
      // 发送请求
      const res = await this.$http.put(`/roles/${id}`, {
        roleName,
        roleDesc
      });

      const { data, meta } = res.data;
      if (meta.status === 200) {
        // 关闭对话框
        this.dialogFormVisible = false;
        // 更新数据列表
        const editRole = this.rolesList.find(item => item.id === id);
        editRole.roleName = data.roleName;
        editRole.roleDesc = data.roleDesc;
      }
    },

    // 点击删除按钮,弹出删除提示框
    /**
     * 根据角色id删除角色
     * @param {number} id
     */
    async delRolesById(id) {
      try {
        await this.$confirm("确定要删除该角色吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // console.log('点击确定删除')

        // 如果点击是确定按钮，就会执行以下代码：
        // 发送请求，删除当前角色
        const res = await this.$http.delete(`/roles/${id}`);
        if (res.data.meta.status === 200) {
          const index = this.rolesList.findIndex(item => item.id === id);
          this.rolesList.splice(index, 1);
        }
      } catch (err) {
        // 如果点击的取消按钮，就会执行以下代码：
        // 相当于处理 Promise 的catch()
        // console.log('点击取消')

        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },

    // 点击分配权限按钮，显示权限展示对话框
    showRightsDialog(curRoleRights, id) {
      this.assignRightDialog = true;
      // this.rightsTree = curRoleRights;
      // 暂存当前角色id
      this.curRoleId = id;
      this.$nextTick(() => {
        // 只要存储第三级权限，第二级和第一级自动选中
        const level3Ids = [];
        curRoleRights.forEach(level1 => {
          level1.children.forEach(level2 => {
            level2.children.forEach(level3 => {
              level3Ids.push(level3.id);
            });
          });
        });

        // 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
        this.$refs.rightsTree.setCheckedKeys(level3Ids);
      });
    },

    // 点击权限对话框确定按钮，修改对话框权限
    async assignRights() {
      // 1 获取到当前角色选中的权限id数组
      // 获取全选项
      const checkedKeys = this.$refs.rightsTree.getCheckedKeys();
      // 获取半选项
      const halfCheckedKeys = this.$refs.rightsTree.getHalfCheckedKeys();
      // 将全选和半选的合并在一起
      const allCheckedIds = [...checkedKeys, ...halfCheckedKeys];

      // 发送请求，更新修改权限数据
      const res = await this.$http.post(`/roles/${this.curRoleId}/rights`, {
        rids: allCheckedIds.join(",")
      });

      if (res.data.meta.status === 200) {
        this.assignRightDialog = false;
        // 注意：需要重新获取角色列表
        this.getRolesList();
      }
    }
  }
};
