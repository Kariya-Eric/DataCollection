import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { login, logout } from '@/api/login'
import { ACCESS_TOKEN, USER_INFO, BUTTON_LIST, ROLE_LIST, REFRESH_TOKEN } from '@/store/mutation-types'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    refreshToken: '',
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken
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
              storage.set(REFRESH_TOKEN, data.refresh_token)
              const { username, userId, account } = data
              storage.set(USER_INFO, { username, userId, account })
              commit('SET_TOKEN', data.access_token)
              commit('SET_USERINFO', { username, userId, account })
              commit('SET_REFRESH_TOKEN', data.refresh_token)
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
        commit('SET_REFRESH_TOKEN', '')
        storage.remove(ACCESS_TOKEN)
        storage.remove(REFRESH_TOKEN)
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
