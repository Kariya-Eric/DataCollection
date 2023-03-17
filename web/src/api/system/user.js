import { postAction, deleteAction } from '@/api/common';

const addUser = (params) => postAction('/uc/api/user/addUser', params)
const updateUser = (params) => postAction('/uc/api/user/update', params)
const updateUserPwd = (params) => postAction('/uc/api/user/updateUserPsw', params)
const deleteBatch = (params) => deleteAction('/uc/api/user/deleteUserByIds', params)

export { addUser, updateUser, updateUserPwd, deleteBatch };