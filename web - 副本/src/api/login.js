import { postAction } from "./api";

const login = (params) => postAction("/uc/api/auth/login", params);

export function logout() {
  // do nothing
  return Promise.resolve();
  // return request.post('/user/logout');
}

export { login };
