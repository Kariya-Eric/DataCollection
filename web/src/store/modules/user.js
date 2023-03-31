import Vue from 'vue'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN } from '../mutation-types'

const user = {
  state: {
    isLogin: false,//登录状态
    user: null,//当前登录的用户
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },

    SET_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin
    }
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      return new Promise((resolve, reject) => {
        login(data).then(res => {
          if (res) {
            const result = res
            Vue.ls.set(ACCESS_TOKEN, result.token)
            commit('SET_USER', result.username)
            commit('SET_LOGIN', true)
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(error => reject(error))
      })
    },

    //登出
    Logout({ commit }) {
      commit('SET_USER', null)
      commit('SET_LOGIN', false)
      Vue.ls.remove(ACCESS_TOKEN)
    }
  }
}

export default user
