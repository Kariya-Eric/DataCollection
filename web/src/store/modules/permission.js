import Vue from "vue";
import { constantRouterMap } from "@/router";
import { getMenuList, getButtonList } from "@/api/system";
import { BUTTON_LIST } from "../mutation-types";

const permission = {
  state: {
    permissionList: [],
  },
  mutations: {
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList;
    },
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateRouter({ commit }, routes) {
      return new Promise((resolve) => {
        let routelist = routes.constRouters;
        commit("SET_PERMISSIONLIST", constantRouterMap.concat(routelist));
        resolve();
      });
    },

    //获取菜单信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuList()
          .then((response) => {
            const menuData =
              response.value.length == 0 ? [] : response.value[0].children;
            resolve(menuData);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    //获取按钮信息
    GetButtonList({ commit }) {
      return new Promise((resolve, reject) => {
        getButtonList()
          .then((response) => {
            const buttons = response.value.curUserMethod;
            Vue.ls.set(BUTTON_LIST, buttons);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};

export default permission;
