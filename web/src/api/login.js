import { postAction } from "./common";

const login = (params) => postAction('/uc/login', params)
const logout = (params) => postAction('/uc/logout', params)

export { login, logout } 