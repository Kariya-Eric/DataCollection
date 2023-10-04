import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_INFO, BUTTON_LIST } from '@/store/mutation-types'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    userInfo: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            const data = response.data
            storage.set(ACCESS_TOKEN, data.token)
            storage.set(USER_INFO, data)
            commit('SET_TOKEN', data.token)
            commit('SET_USERINFO', data)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_USERINFO', {})
            storage.remove(ACCESS_TOKEN)
            storage.remove(USER_INFO)
            storage.remove(BUTTON_LIST)
            resolve()
          })
          .catch((err) => {
            console.log('logout fail:', err)
            // resolve()
          })
          .finally(() => {})
      })
    },
  },
}

export default user