/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import QS from 'qs';

//qs.stringify()是将对象 序列化成URL的形式，以&进行拼接
//  let protocol = window.location.protocol; //协议
//  let host = window.location.host; //主机
//  axios.defaults.baseURL = protocol + "//" + host;
axios.defaults.baseURL = 'http://localhost:8080'


/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
const $get = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
const $post = (url, params) => {
    return new Promise((resolve, reject) => {
        axios.post(url, QS.stringify(params)) //是将对象 序列化成URL的形式，以&进行拼接   
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data)
            })
    });
}
//下面是vue3必须加的，vue2不需要，只需要暴露出去get，post方法就可以
export default {
    install: (app) => {
        app.config.globalProperties['$get'] = $get;
        app.config.globalProperties['$post'] = $post;
        app.config.globalProperties['$axios'] = axios;
    }
}