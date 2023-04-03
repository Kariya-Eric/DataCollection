import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import permission from './modules/permission';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      ...user
    },
    app: {
      namespaced: true,
      ...app
    },
    permission: {
      namespaced: true,
      ...permission
    }
  }
});

export default store;
