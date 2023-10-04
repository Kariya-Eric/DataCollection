import { getAction, putAction, postAction, downFile, deleteAction } from '../../api'

//获取用户详情
const getUserDetail = params => getAction(`/uc/api/user/get/${params}`)
//修改用户
const updateUser = params => putAction('/uc/api/user/updateUser', params)
//新增用户
const addUser = params => postAction('/uc/api/user/addUser', params)
//重置用户密码
const resetPwd = params => postAction('/uc/api/user/updateUserPsw', params)
//下载用户模板
const downloadUserTemp = params => downFile('/uc/api/user/downloadTemplate', params)
//批量删除
const deleteUser = params => deleteAction('/uc/api/user/deleteUserByIds', params)
//获取用户列表
const getUserList = params => postAction('/uc/api/user/getUserPage', params)

export { getUserDetail, updateUser, addUser, resetPwd, downloadUserTemp, deleteUser, getUserList }
