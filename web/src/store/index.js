import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import permission from './modules/permission';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      ...user
    },
    permission: {
      namespaced: true,
      ...permission
    }
  }
});

export default store;
