import Vue from "vue";
import { USER_INFO } from "@/store/mutation-types";
const getters = {
  token: (state) => state.user.token,
  username: (state) => state.user.userInfo.username,
  permissionList: (state) => state.user.permissionList,
  userInfo: (state) => {
    state.user.userInfo = Vue.ls.get(USER_INFO);
    return state.user.userInfo;
  },
  addRouters: (state) => state.permission.addRouters,
};

export default getters;
