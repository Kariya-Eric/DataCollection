import Vue from "vue";
import Router from "vue-router";

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

// To resolve the uncaught in promise issue
// See: https://blog.csdn.net/haidong55/article/details/100939076
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

/* Layout */
import BasicLayout from "@/layouts/BasicLayout";
import UserLayout from "@/layouts/UserLayout";

export const constantRouterMap = [
  {
    path: "/user",
    component: UserLayout,
    redirect: "/user/login",
    name: "Login",
    hidden: true,
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/index/user/login"),
      },
    ],
  },
  {
    path: "/",
    name: "Home",
    redirect: "/home/home",
  },
  {
    path: "/home",
    component: BasicLayout,
    name: "HomePage",
    children: [
      {
        path: "home",
        name: "HomeIndex",
        component: () => import("@/views/index/home/home"),
        meta: {
          title: "首页",
        },
      },
    ],
  },
  {
    path: "/test",
    component: BasicLayout,
    name: "Test",
    children: [
      {
        path: "test",
        name: "TestForm",
        component: () => import("@/views/index/test"),
        meta: {
          title: "Test",
        },
      },
    ],
  },
];

export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRouterMap,
});
