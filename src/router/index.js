import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/Login";
import Home from "@/components/home/Home";
import Users from "@/components/users/Users";

Vue.use(Router);

export default new Router({
  // mode: "history",SS
  routes: [
    {
      path: "/home",
      component: Home,
      children: [{ path: "users", component: Users }]
    },
    {
      path: "/login",
      component: Login
    }
  ]
});
