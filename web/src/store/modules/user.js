import Vue from "vue";
import { login, logout, getUserInfo } from "@/api/login";

import {
  SET_TOKEN,
  SET_ROLES,
  SET_USERINFO,
  ACCESS_TOKEN,
  USER_INFO,
} from "../mutation-types";
import Storage from "vue-ls";
import config from "@/defaultSettings";
Vue.use(Storage, config.storageOptions);

const user = {
  state: {
    token: Vue.ls.get(ACCESS_TOKEN),
    roles: [],
    userInfo: Vue.ls.get(USER_INFO),
  },

  mutations: {
    [SET_TOKEN]: (state, token) => {
      state.token = token;
    },
    [SET_ROLES]: (state, roles) => {
      state.roles = roles;
    },
    [SET_USERINFO]: (state, userInfo) => {
      state.userInfo = userInfo;
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
            commit(SET_TOKEN, data.token);
            commit(SET_USERINFO, data);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((response) => {
            console.log(response);
            const data = response.data;
            if (data.roles != null && data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              commit(SET_ROLES, data.roles);
            } else {
              reject("getInfo: roles must be a non-null array!");
            }
            commit(SET_USERINFO, data.userInfo);
            resolve(response);
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
            commit(SET_ROLES, []);
            Vue.ls.remove(ACCESS_TOKEN);
            Vue.ls.remove(USER_INFO);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(() => {
            console.log("clearing cache...");
            commit(SET_TOKEN, "");
            commit(SET_ROLES, []);
            removeToken();
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};

export default user;
