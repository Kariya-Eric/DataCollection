import router from './router'
import { buildRouters } from './router/generator-routers'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { Modal } from 'ant-design-vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['/user/login', '/test'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/home'

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (store.getters.permissionList.length == 0) {
        // request login userInfo
        store
          .dispatch('GetPermissionList')
          .then(res => {
            let constRouters = buildRouters(res)
            store.dispatch('UpdateRouter', { constRouters }).then(() => {
              router.addRoutes(store.getters.permissionList)
              store.dispatch('GetButtonList').then(() => {
                store.dispatch('GetRoleList').then(() => {
                  next({ ...to, replace: true })
                })
              })
            })
          })
          .catch(() => {
            Modal.confirm({
              title: '登录已过期',
              content: '登陆信息已失效，请重新登录',
              okText: '重新登录',
              mask: false,
              onCancel: () => {
                store.dispatch('Logout').then(() => {
                  try {
                    let path = window.document.location.pathname
                    if (path != '/' && path.indexOf('/user/login') == -1) {
                      window.location.reload()
                    }
                  } catch (e) {
                    window.location.reload()
                  }
                })
              },
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  try {
                    let path = window.document.location.pathname
                    if (path != '/' && path.indexOf('/user/login') == -1) {
                      window.location.reload()
                    }
                  } catch (e) {
                    window.location.reload()
                  }
                })
              }
            })
          })
      } else {
        next()
      }
    }
  } else {
    if (allowList.indexOf(to.path) !== -1) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
