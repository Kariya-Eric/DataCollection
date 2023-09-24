import { postAction } from './api'

const login = (params) => postAction('/uc/api/auth/login', params)

export function logout() {
  return Promise.resolve()
}

export { login }
