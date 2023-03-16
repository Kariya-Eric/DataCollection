import axios from 'axios'
import { Notification } from '@arco-design/web-vue';
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ls from './storage'

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
                Notification.error({
                    title: '系统提示',
                    content: '拒绝访问!',
                    closable: true,
                    duration: 3000,
                    style: { width: '400px' }
                })
                break;
            case 404:
                Notification.error({
                    title: '系统提示',
                    content: '很抱歉,资源未找到!',
                    closable: true,
                    duration: 3000,
                    style: { width: '400px' }
                })
                break;
            case 504:
                Notification.error({
                    title: '系统提示',
                    content: '网络超时!',
                    closable: true,
                    duration: 3000,
                    style: { width: '400px' }
                })
                break;
            default:
                Notification.error({
                    title: '系统提示',
                    content: data.message,
                    closable: true,
                    duration: 3000,
                    style: { width: '400px' }
                })
                break;
        }
    } else {
        Notification.error({
            title: '系统提示',
            content: '未知错误',
            closable: true,
            duration: 3000,
            style: { width: '400px' }
        })
    }
    return Promise.reject(error)
})

// 拦截请求添加请求头
request.interceptors.request.use(config => {
    //附带请求头
    const token = ls.get(ACCESS_TOKEN)
    if (token) {
        config.headers['Authorization'] = "Bearer " + token;
    }
    return config
}, error => Promise.reject(error))

export {
    request as axios
}