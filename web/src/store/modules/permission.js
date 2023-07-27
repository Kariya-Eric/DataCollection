import { constantRouterMap } from "@/router";

/**
 * 通过meta.permission判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.permission) {
    for (let i = 0; i < roles.length; i++) {
      var role = roles[i];
      for (let j = 0; j < role.permissions.length; j++) {
        var perm = role.permissions[j].permission;
        if (route.meta.permission.includes(perm.value)) {
          return true;
        }
      }
    }
    return false;
  }
  return true;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const accessedRouters = routes.filter((route) => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles);
      }
      return true;
    }
    return false;
  });
  return accessedRouters;
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, data) => {
      state.addRouters = data;
      state.routers = constantRouterMap.concat(data);
    },
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateRouter({ commit }, routes) {
      return new Promise((resolve) => {
        let routelist = routes.constRouters;
        commit("SET_ROUTERS", routelist);
        resolve();
      });
    },
  },
};

export default permission;
