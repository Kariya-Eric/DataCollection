import { USER_INFO } from '@/store/mutation-types'
import storage from 'store'
const getters = {
  username: state => state.user.userInfo.username,
  token: state => state.user.token,
  refreshToken: state => state.user.refreshToken,
  userInfo: state => {
    state.user.userInfo = storage.get(USER_INFO)
    return state.user.userInfo
  },
  permissionList: state => state.permission.permissionList,
  roleList: state => state.permission.roleList
}
export default getters
