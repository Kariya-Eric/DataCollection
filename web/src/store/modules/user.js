import Vue from "vue";
import { login, logout } from "@/api/login";

import { ACCESS_TOKEN, USER_INFO, BUTTON_LIST } from "../mutation-types";
import Storage from "vue-ls";
import config from "@/views/index/defaultSettings";
Vue.use(Storage, config.storageOptions);

const user = {
  state: {
    token: Vue.ls.get(ACCESS_TOKEN),
    userInfo: Vue.ls.get(USER_INFO),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, userInfo) => {
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
            Vue.ls.remove(ACCESS_TOKEN);
            Vue.ls.remove(USER_INFO);
            Vue.ls.remove(BUTTON_LIST);
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
