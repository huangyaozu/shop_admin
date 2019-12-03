// import Vue from 'vue'
// 默认导入的是vue.runtime.esm.js
import Vue from "vue";
import App from "./App";
import router from "./router";

// 引入elementUI创建
import ElementUI from "element-ui";
// 引入elementui的样式
import "element-ui/lib/theme-chalk/index.css";

// 引入通用的样式
import "@/assets/common.css";

// 引入axios
import axios from "axios";

// 引入moment
import moment from "moment";
// 把axios放到Vue的原型上， 将来所有的vue实例都能用

Vue.prototype.axios = axios;

// 导入富文本编辑器
import VueQuillEditor from "vue-quill-editor";
// 导入富文本编辑器基本样式
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

// 给axios配置默认值
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
// axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// 给axios设置请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 给config配置baseURL
    // config.baseURL = 'http://localhost:8888/api/private/v1/'
    // 给config设置headers
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// 使用vue-quill-editor插件
Vue.use(VueQuillEditor)
// 使用elementui插件
Vue.use(ElementUI);

//定义过滤器
Vue.filter("dateFilter", (input, format = "YYYY-MM-DD HH:mm:ss") => {
  return moment(input * 1000).format(format);
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
