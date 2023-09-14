import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    config.headers['Authorization'] = 'Bearer ' + token // 让每个请求携带自定义token 请根据实际情况自行修改
    return config
  },
  error => {
    Promise.reject(error)
  }
)

const err = error => {
  if (error.response) {
    let data = error.response.data
    switch (error.response.status) {
      case 404:
        Vue.prototype.$notification.error({
          message: '系统提示',
          description: '很抱歉,资源未找到！',
          duration: 3
        })
        break
      case 401:
        Vue.prototype.$DCModal.error({
          title: '登录已过期',
          content: '很抱歉，登录已过期，请重新登录',
          okText: '重新登录',
          mask: false,
          onOk: () => {
            store.dispatch('LogOut').then(() => {
              Vue.ls.remove(ACCESS_TOKEN)
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
        break
      default:
        Vue.prototype.$notification.error({
          message: '系统提示',
          description: data.message,
          duration: 3
        })
        break
    }
  } else if (error.message) {
    Vue.prototype.$notification.error({
      message: '系统提示',
      description: error.message,
      duration: 3000
    })
  }
  return Promise.reject(error)
}

// response 拦截器
service.interceptors.response.use(response => response.data, err)

export default service
