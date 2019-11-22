import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/Login";
import Home from "@/components/home/Home";

Vue.use(Router);

export default new Router({
  // mode: "history",SS
  routes: [
    {
      path: "/home",
      component: Home
    },
    {
      path: "/login",
      component: Login
    }
  ]
});
