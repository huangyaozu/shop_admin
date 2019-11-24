export default {
  created() {
    this.getUserRightsList();
  },
  data() {
    return {
      userRightsList: []
    };
  },
  methods: {
    indexMethod(index) {
      return index * 1;
    },

    // 进入权限页面显示权限信息
    async getUserRightsList() {
      // 发送请求
      const res = await this.$http.get(`rights/list`);

      const { meta, data } = res.data;
      if (meta.status === 200) {
        console.log(data);

        this.userRightsList = data;
      }
    }
  }
};
