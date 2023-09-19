import Vue from 'vue'
import axios from 'axios'
import { Notification, MessageBox } from 'element-ui'
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
        Notification.error({
          title: '系统提示',
          message: '很抱歉,资源未找到！',
          duration: 3000
        })
        break
      case 401:
        MessageBox.alert('登陆信息已失效，请重新登录', '确定', {
          confirmButtonText: '重新登录',
          type: 'warning',
          callback: action => {
            store.dispatch('LogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        })
        break
      default:
        Notification.error({
          title: '系统提示',
          message: data.message,
          duration: 3000
        })
        break
    }
  } else if (error.message) {
    Notification.error({
      title: '系统提示',
      message: error.message,
      duration: 3000
    })
  }
  return Promise.reject(error)
}

// response 拦截器
service.interceptors.response.use(response => response.data, err)

export default service
