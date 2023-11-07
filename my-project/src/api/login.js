import { getAction, postAction } from './api'

const login = params => postAction('/uc/api/auth/login', params)
const refreshToken = params => getAction('/uc/api/auth/refreshtoken', params)

export function logout() {
  return Promise.resolve()
}

export { login, refreshToken }
