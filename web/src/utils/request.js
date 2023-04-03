import Vue from "vue";
import axios from "axios";
import { Message } from "element-ui";
import store from "../store";
import { ACCESS_TOKEN } from "@/store/mutation-types";

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (store.state.user.token) {
      const token = Vue.ls.get(ACCESS_TOKEN);
      config.headers["Authorization"] = "Bearer " + token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    switch (error.response.status) {
      case 404:
        Message({
          message: "系统提示",
          description: "很抱歉,资源未找到！",
          type: "error",
          duration: 3000,
        });
        break;
      default:
        Message({
          message: "系统提示",
          description: data.message,
          type: "error",
          duration: 3000,
        });
        break;
    }
  } else if (error.message) {
    Message({
      message: "系统提示",
      description: error.message,
      type: "error",
      duration: 3000,
    });
  }
  return Promise.reject(error)
}

// response 拦截器
service.interceptors.response.use((response) => response.data, err);

export default service;

// if (response.status !== 200) {
//     if (response.status === 204) {
//       // 204: NoContent
//       Message({
//         message: "未找到相关信息，请重新输入",
//         type: "error",
//         duration: 5 * 1000,
//       });
//     } else if (response.status === 401) {
//       // 401:Token 过期
//       MessageBox.confirm("你已被登出，请重新登录", "确定登出", {
//         confirmButtonText: "重新登录",
//         cancelButtonText: "取消",
//         type: "warning",
//       }).then(() => {
//         store.dispatch("user/FedLogOut").then(() => {
//           location.reload(); // 为了重新实例化vue-router对象 避免bug
//         });
//       });
//     } else {
//       console.log("error in response.");
//       Message({
//         message: response.status,
//         type: "error",
//         duration: 5 * 1000,
//       });
//     }
//     return Promise.reject("error");
//   } else {
//     var data = response.data;
//     if (data && !data.isSuccess) {
//       // Message({
//       //   message: data.message,
//       //   type: 'error',
//       //   duration: 3000
//       // });
//       return Promise.reject(data);
//     }
//     return data;
//   }
