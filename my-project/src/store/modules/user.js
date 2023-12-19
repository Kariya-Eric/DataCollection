import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_INFO, BUTTON_LIST, ROLE_LIST } from '@/store/mutation-types'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(response => {
            if (response.success) {
              const data = response.data
              storage.set(ACCESS_TOKEN, data.access_token)
              storage.set(USER_INFO, data)
              commit('SET_TOKEN', data.access_token)
              commit('SET_USERINFO', data)
              resolve()
            } else {
              reject('登录出错')
            }
          })
          .catch(error => reject(error))
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        let logoutToken = state.token
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        storage.remove(ACCESS_TOKEN)
        storage.remove(USER_INFO)
        storage.remove(BUTTON_LIST)
        storage.remove(ROLE_LIST)
        logout(logoutToken)
          .then(() => {
            window.location.reload()
            resolve()
          })
          .catch(err => {
            console.log('logout fail:', err)
            // resolve()
          })
          .finally(() => {})
      })
    }
  }
}

export default user
