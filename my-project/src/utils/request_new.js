import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { Modal } from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
})

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在localStorage中
request.setToken = (token, refreshToken) => {
  request.defaults.headers['Authorization'] = `Bearer ${token}`
  // 这里用到的存储是localStorage
  storage.set(ACCESS_TOKEN, token)
  storage.set(REFRESH_TOKEN, refreshToken)
}

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

function refreshToken() {
  // 我项目中  更新token 需要吧原有的token 换成refreshToken去请求   这里根据需求可以改动
  storage.set(ACCESS_TOKEN, storage.get(REFRESH_TOKEN))
  return request({ method: 'get', url: '/uc/api/auth/refreshtoken', headers: { Authorization: 'Bearer ' + storage.get(REFRESH_TOKEN) } })
}

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 每次发送请求之前判断vuex中是否存在token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断

    const token = storage.get(ACCESS_TOKEN)

    token && (config.headers.Authorization = `Bearer ${token}`)

    return config
  },
  error => {
    return Promise.error(error)
  }
)

// 是否正在刷新的标记
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []
// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    const res = error.response
    if (res.status === 401) {
      const config = res.config
      if (!isRefreshing) {
        isRefreshing = true
        try {
          return refreshToken()
            .then(
              res => {
                const { access_token, refresh_token } = res.data

                request.setToken(access_token, refresh_token)
                config.headers['Authorization'] = `Bearer ${access_token}`
                config.baseURL = process.env.VUE_APP_BASE_API
                console.log('token过期刷新接口')
                //  这里有个小问题  当在重试中 如果接口报错 就会直接跳转到登录页  需要后端配合
                // 已经刷新了token，将所有队列中的请求进行重试

                requests.forEach(cb => cb(access_token))
                requests = []
                return request(config)
              },
              err => {
                Modal.confirm({
                  title: '登录已过期',
                  content: '登陆信息已失效，请重新登录',
                  icon: 'exclamation-circle',
                  cancelButtonProps: { style: { display: 'none' } },
                  okText: '重新登录',
                  mask: false,
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
                console.log('err', err)
              }
            )
            .catch(res => {
              Modal.confirm({
                title: '登录已过期',
                content: '登陆信息已失效，请重新登录',
                icon: 'exclamation-circle',
                cancelButtonProps: { style: { display: 'none' } },
                okText: '重新登录',
                mask: false,
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
              console.error('refreshtoken error =>', res)
            })
            .finally(() => {
              console.log('这边')

              isRefreshing = false
            })
        } catch (e) {
          console.log('eee')
          Modal.confirm({
            title: '登录已过期',
            content: '登陆信息已失效，请重新登录',
            icon: 'exclamation-circle',
            cancelButtonProps: { style: { display: 'none' } },
            okText: '重新登录',
            mask: false,
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
        }
      } else {
        // 正在刷新token，将返回一个未执行resolve的promise
        // 保存函数 等待执行
        // 吧请求都保存起来 等刷新完成后再一个一个调用
        return new Promise(resolve => {
          // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
          requests.push(token => {
            config.baseURL = process.env.VUE_APP_BASE_API
            config.headers['Authorization'] = `Bearer ${token}`
            resolve(request(config))
          })
        })
      }
    } else if (res.status === 404) {
      notification.error({
        message: '系统提示',
        description: '很抱歉,资源未找到！'
      })
    } else {
      notification.error({
        message: '系统提示',
        description: res.data.message || res.data.shortMessage || '系统提示'
      })
    }
    return Promise.reject()
  }
)

export default request
export { installer as VueAxios, request as axios }
