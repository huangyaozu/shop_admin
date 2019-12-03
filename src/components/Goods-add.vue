<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- tabs组建 -->
    <el-tabs tab-position="left" @tab-click="change" v-model="activeName">
      <el-tab-pane name="basic" label="基本信息">
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              clearable
              change-on-select
              v-model="form.goods_cat"
              :options="options"
              :props="props"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="form.is_promote" label="1">是</el-radio>
            <el-radio v-model="form.is_promote" label="2">否</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="next(1, 'pic')">
              下一步
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="pic" label="商品图片">
        <!-- 上传图片的组件 -->
        <!-- action：指定图片上传的地址 -->
        <!-- headers:设置token -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          :on-success="handlerSucess"
          :on-remove="handlerRemove"
          list-type="picture"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>

      <el-tab-pane name="content" label="商品内容">
        <!-- 使用富文本编辑器 -->
        <quill-editor
          class="myEditor"
          v-model="form.goods_introduce"
        ></quill-editor>
        <!-- 按钮 -->
        <el-button type="primary" @click="addGood">添加</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      // 添加商品相关数据信息
      form: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        is_promote: "1",
        goods_cat: [],
        // 用于接收上传成功的图片的信息
        pics: [],
        goods_introduce: ""
      },
      options: [],
      props: {
        value: "cat_id",
        label: "cat_name"
      },
      activeName: "basic",
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  methods: {
    change(tab) {
      // console.log(tab);
      this.active = +tab.index;
    },
    // 去下一页
    next(active, activeName) {
      this.active = active;
      this.activeName = activeName;
    },
    handlerSucess(response, file, fileList) {
      // 通过response获取到上传成功后的图片的地址
      // 存储到this.form.pics中
      this.form.pics.push({
        pic: response.data.tmp_path
      });
    },
    handlerRemove(file) {
      let tmpPath = file.response.data.tmp_path;
      // 去数组中找到tmpPath对应的下标
      let idx = this.form.pics.findIndex(item => item.pic === tmpPath);
      this.form.pics.splice(idx, 1);
    },
    async addGood() {
      // 发送ajax请求，把收集到的所有的数据发送服务端
      let res = await this.axios.post("goods", {
        ...this.form,
        goods_cat: this.form.goods_cat.join()
      });
      let {
        meta: { status }
      } = res.data;
      if (status === 201) {
        this.$router.push("/goods");
        this.$message.success("添加商品成功了");
      }
    }
  },

  async created() {
    //发送请求，获取数据
    let res = await this.axios.get("categories?type=3");
    let {
      meta: { status },
      data
    } = res.data;
    if (status === 200) {
      this.options = data;
    }
  }
};
</script>

<style lang="less" scoped>
// 如果给组件添加了scoped，保证样式只有在当前组件生效
.myEditor {
  background-color: #fff;
  /deep/ .ql-editor {
    height: 300px;
  }
}
</style>
