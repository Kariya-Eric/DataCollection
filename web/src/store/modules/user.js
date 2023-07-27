import Vue from "vue";
import { login, logout } from "@/api/login";
import { getMenuList, getButtonList } from "@/api/system";

import { ACCESS_TOKEN, USER_INFO } from "../mutation-types";
import Storage from "vue-ls";
import config from "@/views/index/defaultSettings";
Vue.use(Storage, config.storageOptions);

const user = {
  state: {
    token: Vue.ls.get(ACCESS_TOKEN),
    userInfo: Vue.ls.get(USER_INFO),
    permissionList: [],
    buttonList: [],
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList;
    },
    SET_BUTTONLIST: (state, buttonList) => {
      state.buttonList = buttonList;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            const data = response.data;
            Vue.ls.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000);
            Vue.ls.set(USER_INFO, data);
            commit("SET_TOKEN", data.token);
            commit("SET_USERINFO", data);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            commit("SET_PERMISSIONLIST", []);
            commit("SET_BUTTONLIST", []);
            Vue.ls.remove(ACCESS_TOKEN);
            Vue.ls.remove(USER_INFO);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    //获取菜单信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuList()
          .then((response) => {
            const menuData = response.value[0].children;
            if (menuData && menuData.length > 0) {
              commit("SET_PERMISSIONLIST", menuData);
            } else {
              reject(
                "getPermissionList: permissions must be a non-null array !"
              );
            }
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
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};

export default user;
