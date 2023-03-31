import Vue from 'vue'
import axios from 'axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 指定axios的base URL
const apiBaseUrl = 'http://localhost:8080/';

// 创建axios实例
const request = axios.create({
    baseURL: apiBaseUrl,
    timeout: 20000  //超时时间
})

//请求拦截
request.interceptors.response.use(response => {
    return response.data
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 403:
                this.$notification.error({
                    title: '系统提示',
                    content: '拒绝访问!',
                    duration: 4,
                })
                break;
            case 404:
                this.$notification.error({
                    title: '系统提示',
                    content: '很抱歉,资源未找到!',
                    duration: 4,
                })
                break;
            case 504:
                this.$notification.error({
                    title: '系统提示',
                    content: '网络超时!',
                    duration: 4,
                })
                break;
            default:
                this.$notification.error({
                    title: '系统提示',
                    content: data.message,
                    duration: 4,
                })
                break;
        }
    } else {
        this.$notification.error({
            title: '系统提示',
            content: '未知错误',
            duration: 4,
        })
    }
    return Promise.reject(error)
})

// 拦截请求添加请求头
request.interceptors.request.use(config => {
    //附带请求头
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (token) {
        config.headers['Authorization'] = "Bearer " + token;
    }
    return config
}, error => Promise.reject(error))

export {
    request as axios
}