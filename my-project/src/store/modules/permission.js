import { getMenuList, getButtonList } from '@/api/system'
import { getRoleList } from '@/api/system/role'
import { BUTTON_LIST, USER_INFO, ROLE_LIST } from '../mutation-types'
import { getUserDetail } from '@/api/system/user'
import { constantRouterMap } from '@/router'
import storage from 'store'

const permission = {
  state: {
    permissionList: [],
    roleList: []
  },
  mutations: {
    SET_PERMISSIONLIST: (state, permissionList) => {
      state.permissionList = permissionList
    },
    SET_ROLELIST: (state, roleList) => {
      state.roleList = roleList
    }
  },
  actions: {
    // 动态添加主界面路由，需要缓存
    UpdateRouter({ commit }, routes) {
      return new Promise(resolve => {
        let routelist = routes.constRouters
        constantRouterMap[1].children = constantRouterMap[1].children.concat(routelist)
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
    },

    // 后端不在用户登录信息里加角色有什么办法呢？
    GetRoleList({ commit }) {
      return new Promise((resolve, reject) => {
        getRoleList({})
          .then(res => {
            getUserDetail(storage.get(USER_INFO).userId)
              .then(response => {
                const roleIds = response.value.roleIds
                if (!roleIds) {
                  storage.set(ROLE_LIST, ['superAdmin'])
                } else {
                  let roles = []
                  roleIds.forEach(element => {
                    res.value.rows.forEach(row => {
                      if (row.id == element) {
                        roles.push(row.code)
                      }
                    })
                  })
                  storage.set(ROLE_LIST, roles)
                }
                resolve()
              })
              .catch(error => {
                reject(error)
              })
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default permission
