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
              router.addRoutes(store.getters.addRouters);
              next({ ...to, replace: true });
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

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive("action", {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg;
    const roles = store.state.user.roles;
    const permissionId = vnode.context.$route.meta.permission[0];
    let hasPermAct = false;
    roles.forEach((r) => {
      let actions = [];
      r.permissions.forEach((p) => {
        if (p.permission.value !== permissionId) {
          return;
        }
        actions = p.actions;
        if (
          actions.findIndex((act) => {
            return act === actionName;
          }) >= 0
        ) {
          hasPermAct = true;
        }
      });
    });
    if (hasPermAct === false) {
      setTimeout(() => {
        if (el.parentNode == null) {
          el.style.display = "none";
        } else {
          el.parentNode.removeChild(el);
        }
      }, 10);
    }
  },
});

export { action };
