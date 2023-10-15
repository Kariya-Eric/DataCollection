import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { Modal } from 'ant-design-vue'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  console.log('errorH', error.response)
  if (error.response) {
    console.log('switch', error.response.status)
    const data = error.response.data
    switch (error.response.status) {
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉,资源未找到！'
        })
        break
      case 401:
        Modal.confirm({
          title: '登录已过期',
          content: '登陆信息已失效，请重新登录',
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
        break
      default:
        notification.error({
          message: '系统提示',
          description: data.message
        })
        break
    }
  } else {
    console.log('default')
    notification.error({
      message: '系统提示',
      description: data.message
    })
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }
