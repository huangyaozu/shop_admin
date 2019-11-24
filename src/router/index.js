import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/Login";
import Home from "@/components/home/Home";
import Users from "@/components/users/Users";
import Roles from "@/components/roles/Roles";
import Rights from "@/components/rights/Rights";

Vue.use(Router);

export default new Router({
  // mode: "history",SS
  routes: [
    {
      path: "/home",
      component: Home,
      children: [
        { path: "users", component: Users },
        { path: "roles", component: Roles },
        { path: "rights", component: Rights }
      ]
    },
    {
      path: "/login",
      component: Login
    }
  ]
});
