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
        component: () => import("@/views/user/login"),
      },
      {
        path: "recover",
        name: "recover",
        // component: () => import('@/views/user/login'),
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/exception/404"),
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
        component: () => import("@/views/dashboard/analysis"),
        meta: {
          title: "分析页",
          // permission: ['analysis']
        },
      },
      {
        path: "monitor",
        name: "Monitor",
        component: () => import("@/views/dashboard/monitor"),
        meta: {
          title: "监控页",
          // permission: ['monitor']
        },
      },
      {
        path: "workplace",
        name: "WorkPlace",
        component: () => import("@/views/dashboard/workplace"),
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
        component: () => import("@/views/task/list"),
        meta: {
          title: "任务列表",
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
        component: () => import("@/views/system/user/list"),
        meta: {
          title: "用户管理",
          icon: "list",
        },
      },
    ],
  },
  {
    path: "/test",
    component: BasicLayout,
    name: "测试",
    alwaysShow: true,
    meta: {
      title: "测试",
      icon: "dashboard",
      // permission: ['monitorcenter', 'taskcenter']
    },
    children: [
      {
        path: "/test/form",
        name: "WorkPlace",
        component: () => import("@/views/form/list"),
        meta: {
          title: "测试表单",
          icon: "test",
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
        component: () => import("@/views/dashboard/analysis"),
        meta: {
          title: "分析页",
          // permission: ['analysis']
        },
      },
      {
        path: "monitor",
        name: "Monitor",
        component: () => import("@/views/dashboard/monitor"),
        meta: {
          title: "监控页",
          // permission: ['monitor']
        },
      },
      {
        path: "workplace",
        name: "WorkPlace",
        component: () => import("@/views/dashboard/workplace"),
        meta: {
          title: "工作台",
          // permission: ['workplace']
        },
      },
    ],
  },

  // Form
  //   {
  //     path: "/form",
  //     component: BasicLayout,
  //     redirect: "/form/basic-form",
  //     name: "Form",
  //     alwaysShow: true,
  //     meta: {
  //       title: "表单页",
  //       icon: "edit",
  //     },
  //     children: [
  //       {
  //         path: "basic-form",
  //         name: "BasicForm",
  //         component: () => import("@/views/form1/basicform"),
  //         meta: {
  //           title: "基础表单",
  //         },
  //       },
  //       {
  //         path: "step-form",
  //         name: "StepForm",
  //         component: () => import("@/views/form1/stepform/stepform"),
  //         meta: {
  //           title: "分步表单",
  //         },
  //       },
  //       {
  //         path: "advanced-form",
  //         name: "AdvancedForm",
  //         component: () => import("@/views/form1/advancedform/advancedform"),
  //         meta: {
  //           title: "高级表单",
  //         },
  //       },
  //     ],
  //   },

  // List
  //   {
  //     path: "/list",
  //     component: BasicLayout,
  //     redirect: "/list/table-list",
  //     name: "List",
  //     alwaysShow: true,
  //     meta: {
  //       title: "列表页",
  //       icon: "list",
  //     },
  //     children: [
  //       {
  //         path: "table-list",
  //         name: "TableList",
  //         redirect: "/usermgmt/userlist",
  //         meta: {
  //           title: "查询表格",
  //         },
  //       },
  //       {
  //         path: "basic-list",
  //         name: "BasicList",
  //         component: () => import("@/views/list/basiclist"),
  //         meta: {
  //           title: "标准列表",
  //         },
  //       },
  //       {
  //         path: "card-list",
  //         name: "CardList",
  //         component: () => import("@/views/list/cardlist"),
  //         meta: {
  //           title: "卡片列表",
  //         },
  //       },
  //     ],
  //   },

  //   // Detail
  //   {
  //     path: "/detail",
  //     component: BasicLayout,
  //     redirect: "/detail/basic-detail",
  //     name: "Detail",
  //     alwaysShow: true,
  //     meta: {
  //       title: "详情页",
  //       icon: "detail",
  //     },
  //     children: [
  //       {
  //         path: "basic-detail",
  //         name: "BasicDetail",
  //         component: () => import("@/views/detail/basicdetail"),
  //         meta: {
  //           title: "基础详情页",
  //         },
  //       },
  //       {
  //         path: "advanced-detail",
  //         name: "AdvancedDetail",
  //         component: () => import("@/views/detail/advanceddetail"),
  //         meta: {
  //           title: "高级详情页",
  //         },
  //       },
  //     ],
  //   },

  //   // User Management
  //   {
  //     path: "/usermgmt",
  //     component: BasicLayout,
  //     redirect: "/usermgmt/userlist",
  //     name: "UserMgmt",
  //     alwaysShow: true,
  //     meta: {
  //       title: "用户页",
  //       icon: "user-group",
  //       permission: ["permission", "role", "user"],
  //     },
  //     children: [
  //       {
  //         path: "permissionlist",
  //         name: "PermissionList",
  //         component: () => import("@/views/usermgmt/permissionlist"),
  //         meta: {
  //           title: "权限列表",
  //           permission: ["permission"],
  //         },
  //       },
  //       {
  //         path: "rolelist",
  //         name: "RoleList",
  //         component: () => import("@/views/usermgmt/rolelist"),
  //         meta: {
  //           title: "角色管理",
  //           permission: ["role"],
  //         },
  //       },
  //       {
  //         path: "userlist",
  //         name: "UserList",
  //         component: () => import("@/views/usermgmt/userlist"),
  //         meta: {
  //           title: "用户列表",
  //           permission: ["user"],
  //         },
  //       },
  //     ],
  //   },

  //   // Result
  //   {
  //     path: "/result",
  //     component: BasicLayout,
  //     redirect: "/result/success",
  //     name: "Result",
  //     alwaysShow: true,
  //     meta: {
  //       title: "结果页",
  //       icon: "correct-line",
  //     },
  //     children: [
  //       {
  //         path: "success",
  //         name: "ResultSuccess",
  //         component: () => import("@/views/result/success"),
  //         meta: {
  //           title: "成功页",
  //         },
  //       },
  //       {
  //         path: "fail",
  //         name: "ResultFail",
  //         component: () => import("@/views/result/fail"),
  //         meta: {
  //           title: "失败页",
  //         },
  //       },
  //     ],
  //   },

  //   // Exception
  //   {
  //     path: "/exception",
  //     component: BasicLayout,
  //     redirect: "/exception/404",
  //     name: "Exception",
  //     alwaysShow: true,
  //     meta: {
  //       title: "异常页",
  //       icon: "warn",
  //     },
  //     children: [
  //       {
  //         path: "403",
  //         name: "Exception403",
  //         component: () => import("@/views/exception/403"),
  //         meta: {
  //           title: "403",
  //         },
  //       },
  //       {
  //         path: "404",
  //         name: "Exception404",
  //         component: () => import("@/views/exception/404"),
  //         meta: {
  //           title: "404",
  //         },
  //       },
  //       {
  //         path: "500",
  //         name: "Exception500",
  //         component: () => import("@/views/exception/500"),
  //         meta: {
  //           title: "500",
  //         },
  //       },
  //     ],
  //   },

  //   // Account Center
  //   {
  //     path: "/accountcenter",
  //     component: BasicLayout,
  //     redirect: "/accountcenter/accountcenter",
  //     name: "Profile",
  //     alwaysShow: true,
  //     meta: {
  //       title: "个人中心",
  //       icon: "user",
  //     },
  //     children: [
  //       {
  //         path: "accountcenter",
  //         name: "AccountCenter",
  //         component: () => import("@/views/profile/index"),
  //         meta: {
  //           title: "个人中心",
  //         },
  //       },
  //       {
  //         path: "accountsetting",
  //         name: "AccountSetting",
  //         component: () => import("@/views/profile/accountsetting"),
  //         meta: {
  //           title: "个人设置",
  //         },
  //       },
  //     ],
  //   },

  //   // External Link
  //   {
  //     path: "external-link",
  //     component: BasicLayout,
  //     children: [
  //       {
  //         path: "http://letech.net.cn",
  //         meta: {
  //           title: "网站首页",
  //           icon: "link",
  //         },
  //       },
  //     ],
  //   },

  //   // Others
  //   {
  //     path: "*",
  //     redirect: "/404",
  //     hidden: true,
  //   },
];

export default new Router({
  mode: "history", //后端支持可开
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRouterMap,
});
