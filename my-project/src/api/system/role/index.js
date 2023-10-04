import { postAction, putAction } from '../../api'

const getRoleList = params => postAction('/uc/api/role/getRolePage', params)

const addRole = params => postAction('/uc/api/role/addRole', params)

const updateRole = params => putAction('/uc/api/role/updateRole', params)

export { getRoleList, addRole, updateRole }
