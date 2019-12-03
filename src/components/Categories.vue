<template>
  <div>
    <el-button type="success" plain @click="showAddCategoriesDialog"
      >添加分类</el-button
    >
    <el-table
      :data="categoriesList"
      :stripe="true"
      style="width: 100%"
      v-loading="loading"
      element-loading-text="亲，等会，玩命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-table-tree-column
        prop="cat_name"
        label="分类名称"
        tree-key="cat_id"
        level-key="cat_level"
        parent-key="cat_pid"
        child-key="children"
        width="180"
        :indent-size="20"
      >
      </el-table-tree-column>

      <el-table-column prop="cat_deleted" label="是否删除" width="120">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted ? "是" : "否" }}
        </template>
      </el-table-column>

      <el-table-column label="菜单级别" width="120" prop="cat_level">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level == 0">一级</span>
          <span v-else-if="scope.row.cat_level == 1">二级</span>
          <span v-else>三级</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
            @click="delCategory(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加分类模态框 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="60%">
      <!-- 表单 -->
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="80px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 注意：清除表单校验的内容，一定需要指定一个prop -->
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader
            change-on-select
            clearable
            :options="options"
            v-model="addForm.cat_pid"
            :props="props"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategories">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入elelemnt-tree-grid包
var ElTreeGrid = require("element-tree-grid");
export default {
  data() {
    return {
      query: "",
      current: 1,
      pagesize: 10,
      total: 0,
      loading: true,
      addDialogVisible: false,
      categoriesList: [],

      // 商品分类数据
      addDialogVisible: false,
      addForm: {
        cat_name: "",
        cat_pid: []
      },
      rules: {
        cat_name: [
          {
            require: true,
            message: "请输入分类名",
            trigger: "change"
          }
        ]
      },
      options: [],
      props: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    // 获取列表的数据
    this.getCategoryList();
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      let res = await this.axios.get("categories", {
        params: { type: 3, pagenum: this.current, pagesize: this.pagesize }
      });
      let {
        meta: { status },
        data: { result, total }
      } = res.data;
      if (status === 200) {
        this.categoriesList = result;
        this.total = total;
        // 把loading加载状态清除即可
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }
    },
    // 修改了每页的条数
    handleSizeChange(val) {
      this.loading = true;
      this.pagesize = val;
      this.current = 1;
      this.getCategoryList();
    },
    // 修改了当前页的页码
    handleCurrentChange(val) {
      this.loading = true;
      this.current = val;
      this.getCategoryList();
    },

    // 显示添加类型模态框
    async showAddCategoriesDialog() {
      this.addDialogVisible = true;
      // 发送ajax请求，获取分类的属性（1级和2级）
      let res = await this.axios.get("categories?type=2");
      let {
        meta: { status },
        data
      } = res.data;
      if (status === 200) {
        this.options = data;
        console.log(this.options);
      }
    },

    // 添加分类确定
    addCategories() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return false;
        }
        // 发送ajax请求
        let { cat_name: catName, cat_pid: catPid } = this.addForm;
        let res = await this.axios.post("categories", {
          // 如果是一级分类，pid为0
          cat_pid: catPid[catPid.length - 1] || 0,
          cat_name: catName,
          cat_level: catPid.length
        });
        let {
          meta: { status, msg }
        } = res.data;
        if (status === 201) {
          this.addDialogVisible = false;
          this.$refs.addForm.resetFields();
          this.getCategoryList();
          this.$message.success("添加分类成功了");
        } else {
          this.$message.error(msg);
        }
      });
    },

    //删除分类
    async delCategory(row) {
      await this.$confirm("你确定要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
      // 发送ajax请求
      let res = await this.axios.delete(`categories/${row.cat_id}`);
      let {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.getCategoryList();
        this.$message.success("删除分类成功了");
      } else {
        this.$message.error(msg);
      }
    }
  },
  components: {
    // 把ElTreeGrid注册为局部的组件
    // 'el-table-tree-column': ElTreeGrid
    [ElTreeGrid.name]: ElTreeGrid
  }
};
</script>

<style lang="less" scoped></style>
