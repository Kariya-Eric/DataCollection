import Vue from "vue";
import router from "@/router";
import store from "@/store";
import NProgress from "nprogress"; // progress bar
import { ACCESS_TOKEN } from "@/store/mutation-types";
import "nprogress/nprogress.css"; // progress bar style
import { buildRouters } from "@/utils/router";

NProgress.configure({
  showSpinner: false,
}); // NProgress Configuration

const whiteList = ["/user/login"]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start(); // start progress bar
  // has token
  if (Vue.ls.get(ACCESS_TOKEN)) {
    if (to.path === "/test") {
      next();
      NProgress.done();
    }
    if (to.path === "/user/login") {
      next({ path: "/" });
      NProgress.done(); // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.permissionList.length == 0) {
        store
          .dispatch("GetPermissionList")
          .then((res) => {
            let constRouters = buildRouters(res);
            store.dispatch("UpdateRouter", { constRouters }).then(() => {
              console.log(store.getters.addRouters);
              router.addRoutes(store.getters.addRouters);
              store.dispatch("GetButtonList").then(() => {
                next({ ...to, replace: true });
              });
            });
          })
          .catch(() => console.log("请求用户信息失败，请重试！"));
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/user/login?redirect=${to.path}`); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
