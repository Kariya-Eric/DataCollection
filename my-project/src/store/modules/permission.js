import { getMenuList, getButtonList } from '@/api/system'
import { BUTTON_LIST } from '../mutation-types'
import { constantRouterMap } from '@/router'
import storage from 'store'

const permission = {
  state: {
    permissionList: []
  },
  mutations: {
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    }
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateRouter({ commit }, routes) {
      return new Promise(resolve => {
        let routelist = routes.constRouters
        // constantRouterMap[1].children = constantRouterMap[1].children.concat(routelist)
        commit('SET_PERMISSIONLIST', constantRouterMap)
        resolve()
      })
    },

    //获取菜单信息
    GetPermissionList({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuList()
          .then(response => {
            const menuData = response.value.length == 0 ? [] : response.value[0].children
            resolve(menuData)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    //获取按钮信息
    GetButtonList({ commit }) {
      return new Promise((resolve, reject) => {
        getButtonList()
          .then(response => {
            const buttons = response.value.curUserMethod
            storage.set(BUTTON_LIST, buttons)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default permission
