import { postAction } from "./api";
import request from "@/utils/request";

const login = (params) => postAction("/uc/api/login", params);

export function getUserInfo() {
  return request.get("/auth/userinfo");
}

export function getAccountInfo(accountId) {
  return request.get("/account/info/" + accountId);
}

export function logout() {
  // do nothing
  return Promise.resolve();
  // return request.post('/user/logout');
}

export { login };
