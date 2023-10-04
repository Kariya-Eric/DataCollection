import { getAction, postAction, deleteAction, putAction } from '../../api'

const initDeptTree = params => getAction(`/uc/api/org/getOrgTree?userId=${params}`)

const getOrg = params => getAction(`/uc/api/org/get/${params}`)

const getOrgUser = params => getAction(`/uc/api/org/getOrgUser/${params.orgId}?keyword=${params.keyword}&roleId=${params.roleId}`)

const updateOrg = params => putAction('/uc/api/org/updateOrg', params)

const addOrg = params => postAction('/uc/api/org/addOrg', params)

export { initDeptTree, getOrg, getOrgUser, updateOrg, addOrg }
