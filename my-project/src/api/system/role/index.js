import { getAction, postAction, putAction } from '../../api'

const getRoleList = params => postAction('/uc/api/role/getRolePage', params)
const addRole = params => postAction('/uc/api/role/addRole', params)
const updateRole = params => putAction('/uc/api/role/updateRole', params)
//资源授权-获取左侧菜单树
const getAllMenuByRoleCode = params => getAction(`/uc/api/sysMenu/getAllMenuByRoleCode?roleCode=${params}`)
//资源授权-获取右侧权限列表
const getAllMethodByRoleCode = params => getAction(`/uc/api/sysMenu/getAllMethodByRoleCode?roleCode=${params}`)
//资源授权
const saveRoleAuth = params => postAction('/uc/api/sysMenu/saveRoleAuth', params)
export { getRoleList, addRole, updateRole, getAllMenuByRoleCode, getAllMethodByRoleCode, saveRoleAuth }
