import axios from 'axios'
import { Notification } from '@arco-design/web-vue';

// 指定axios的base URL
const apiBaseUrl = window._CONFIG['baseURL'] || '/data-collection';

// 创建axios实例
const request = axios.create({
    baseURL: apiBaseUrl,
    timeout: 20000  //超时时间
})

const err = (error) => {
    if (error.response) {
        let data = error.response.data
        switch (error.response.status) {
            case 403:
                () => {
                    Notification.error({
                        title: '系统提示',
                        content: '拒绝访问!',
                        closable: true,
                        duration: 4,
                        style: { width: '500px' }
                    })
                }
                break;
            case 404:
                () => {
                    Notification.error({
                        title: '系统提示',
                        content: '很抱歉,资源未找到!',
                        closable: true,
                        duration: 4,
                        style: { width: '500px' }
                    })
                }
                break;
            case 504:
                () => {
                    Notification.error({
                        title: '系统提示',
                        content: '网络超时!',
                        closable: true,
                        duration: 4,
                        style: { width: '500px' }
                    })
                }
                break;
            default:
                () => {
                    Notification.error({
                        title: '系统提示',
                        content: data.message,
                        closable: true,
                        duration: 4,
                        style: { width: '500px' }
                    })
                }
                break;
        }
    }
    return Promise.reject(error)
}

export {
    service as axios
}