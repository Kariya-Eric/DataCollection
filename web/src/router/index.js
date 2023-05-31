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

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                will it become nested mode, otherwise it will not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: "/user",
    component: UserLayout,
    redirect: "/user/login",
    name: "User",
    hidden: true,
    // meta: {
    //   title: 'User',
    //   icon: 'dashboard'
    // },
    children: [
      {
        path: "login",
        name: "Login",
        component: () => import("@/views/index/user/login"),
      },
      {
        path: "recover",
        name: "recover",
        // component: () => import('@/views/index/user/login'),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/index/exception/404"),
    hidden: true,
  },
  {
    path: "/dashboard",
    component: BasicLayout,
    redirect: "/dashboard/workplace",
    name: "Dashboard",
    alwaysShow: true,
    meta: {
      title: "Dashboard",
      icon: "dashboard",
      // permission: ['monitorcenter', 'taskcenter']
    },
    children: [
      {
        path: "analysis",
        name: "Analysis",
        component: () => import("@/views/index/dashboard/analysis"),
        meta: {
          title: "分析页",
          // permission: ['analysis']
        },
      },
      {
        path: "monitor",
        name: "Monitor",
        component: () => import("@/views/index/dashboard/monitor"),
        meta: {
          title: "监控页",
          // permission: ['monitor']
        },
      },
      {
        path: "workplace",
        name: "WorkPlace",
        component: () => import("@/views/index/dashboard/workplace"),
        meta: {
          title: "工作台",
          // permission: ['workplace']
        },
      },
    ],
  },
  {
    path: "/task",
    component: BasicLayout,
    name: "task",
    alwaysShow: true,
    meta: {
      title: "任务管理",
      icon: "dashboard",
    },
    children: [
      {
        path: "/task/list",
        name: "taskList",
        component: () => import("@/views/index/task/list"),
        meta: {
          title: "任务列表",
          icon: "list",
        },
      },
      {
        path: "/task/detail",
        name: "taskDetail",
        component: () => import("@/views/index/task/detail"),
        meta: {
          title: "任务详情",
          icon: "list",
        },
      },
    ],
  },
  {
    path: "/sys",
    component: BasicLayout,
    name: "system",
    alwaysShow: true,
    meta: {
      title: "系统管理",
      icon: "dashboard",
    },
    children: [
      {
        path: "/sys/user",
        name: "userList",
        component: () => import("@/views/index/system/user/list"),
        meta: {
          title: "用户管理",
          icon: "list",
        },
      },
      {
        path: "/sys/role",
        name: "roleList",
        component: () => import("@/views/index/system/role/list"),
        meta: {
          title: "角色管理",
          icon: "list",
        },
      },
      {
        path: "/sys/menu",
        name: "menuList",
        component: () => import("@/views/index/system/menu/list"),
        meta: {
          title: "菜单管理",
          icon: "list",
        },
      },
      {
        path: "/sys/depart",
        name: "departList",
        component: () => import("@/views/index/system/depart/list"),
        meta: {
          title: "组织管理",
          icon: "list",
        },
      },
    ],
  },
  {
    path: "/form",
    component: BasicLayout,
    name: "analyze",
    alwaysShow: true,
    meta: {
      title: "表单管理",
      icon: "dashboard",
    },
    children: [
      {
        path: "/form/list",
        name: "formList",
        component: () => import("@/views/index/form/list"),
        meta: {
          title: "表单列表",
          icon: "list",
        },
      },
      {
        path: '/form/detail/:id/:name/:type/:year',
        name: "formDetail",
        component: () => import("@/views/index/form/detail"),
        hidden: true,
        meta: {
          title: "表单详情",
          icon: "list"
        }
      }
    ],
  },
  {
    path: "/analyze",
    component: BasicLayout,
    name: "analyze",
    alwaysShow: true,
    meta: {
      title: "分析报告",
      icon: "dashboard",
    },
    children: [
      {
        path: "/analyze/list",
        name: "analyzeList",
        component: () => import("@/views/index/analyze/list"),
        meta: {
          title: "分析报告",
          icon: "list",
        },
      },
      {
        path: "/analyze/detail",
        name: "detail",
        component: () => import("@/views/index/analyze/detail"),
        meta: {
          title: "报告详情",
          icon: "list",
        },
      },
    ],
  },
];

export const asyncRouterMap = [
  // Dashboard
  {
    path: "/dashboard",
    component: BasicLayout,
    redirect: "/dashboard/workplace",
    name: "Dashboard",
    alwaysShow: true,
    meta: {
      title: "Dashboard",
      icon: "dashboard",
      // permission: ['monitorcenter', 'taskcenter']
    },
    children: [
      {
        path: "analysis",
        name: "Analysis",
        component: () => import("@/views/index/dashboard/analysis"),
        meta: {
          title: "分析页",
          // permission: ['analysis']
        },
      },
      {
        path: "monitor",
        name: "Monitor",
        component: () => import("@/views/index/dashboard/monitor"),
        meta: {
          title: "监控页",
          // permission: ['monitor']
        },
      },
      {
        path: "workplace",
        name: "WorkPlace",
        component: () => import("@/views/index/dashboard/workplace"),
        meta: {
          title: "工作台",
          // permission: ['workplace']
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
