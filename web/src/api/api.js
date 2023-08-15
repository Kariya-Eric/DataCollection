import request from "@/utils/request";
import signMd5Utils from "@/utils/encryption/signMd5Util";

//post
export function postAction(url, parameter) {
  let sign = signMd5Utils.getSign(url, parameter);
  //将签名和时间戳，添加在请求接口 Header
  let signHeader = {
    "X-Sign": sign,
    "X-TIMESTAMP": signMd5Utils.getTimestamp(),
  };
  return request({
    url: url,
    method: "post",
    data: parameter,
    headers: signHeader,
  });
}

//put
export function putAction(url, parameter) {
  return request({
    url: url,
    method: "put",
    data: parameter,
  });
}

//get
export function getAction(url, parameter) {
  let sign = signMd5Utils.getSign(url, parameter);
  //将签名和时间戳，添加在请求接口 Header
  let signHeader = {
    "X-Sign": sign,
    "X-TIMESTAMP": signMd5Utils.getTimestamp(),
  };
  return request({
    url: url,
    method: "get",
    params: parameter,
    headers: signHeader,
  });
}

//deleteAction
export function deleteAction(url, parameter) {
  return request({
    url: url + `?${parameter}`,
    method: "delete",
  });
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter, method = "get") {
  if (method == "get") {
    return request({
      url: url,
      params: parameter,
      method: method,
      responseType: "blob",
    });
  } else {
    return request({
      url: url,
      method: method,
      data: parameter,
      responseType: "blob",
    });
  }
}

/**
 * 文件上传
 * @param url
 * @param parameter
 * @returns {*}
 */
export function uploadAction(url, parameter) {
  return request({
    url: url,
    data: parameter,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data", // 文件上传
    },
  });
}
