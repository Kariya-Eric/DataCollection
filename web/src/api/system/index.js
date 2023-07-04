import { getAction, deleteAction, putAction, postAction } from "../api";

//新增用户
const addUser = (params) => postAction("/uc/api/user/addUser", params);
//修改用户
const updateUser = (params) => putAction("/uc/api/user/updateUser", params);
//重置密码
const resetPwd = (params) => postAction("/uc/api/user/updateUserPsw", params);
//批量删除用户
const delUserBatch = (params) =>
  deleteAction("/uc/api/user/deleteUserByIds", params);
//新增角色
const addRole = (params) => postAction("/uc/api/role/addRole", params);
//修改角色
const updateRole = (params) => putAction("/uc/api/role/updateRole", params);
//获取菜单树
const initMenuTree = (params) => getAction("/uc/api/sysMenu/getTree", params);
//根据id获取菜单详情
const getMenu = (params) => getAction(`/uc/api/sysMenu/get?id=${params}`);
//获取组织树
const initDeptTree = (params) =>
  getAction(`/uc/api/org/getOrgTree?userId=${params}`);
//新增修改菜单
const saveMenu = (params) => postAction("/uc/api/sysMenu/save", params);
//资源授权-获取左侧菜单树
const getAllMenuByRoleCode = (params) =>
  getAction(`/uc/api/sysMenu/getAllMenuByRoleCode?roleCode=${params}`);
//资源授权-获取右侧权限列表
const getAllMethodByRoleCode = (params) =>
  getAction(`/uc/api/sysMenu/getAllMethodByRoleCode?roleCode=${params}`);
//获取组织详情
const getOrgInfo = (params) => getAction(`/uc/api/org/get/${params}`);
//获取组织人员
const getOrgUser = (params) =>
  getAction(
    `/uc/api/org/getOrgUser/${params.orgId}?keyword=${params.keyWord}&roleId=${params.roleId}`
  );
//删除组织
const delOrg = (params) => deleteAction("/uc/api/org/getOrgTree", params);
//资源授权
const saveRoleAuth = (params) =>
  postAction("/uc/api/sysMenu/saveRoleAuth", params);
//批量解除关系
const delOrgUser = (params) => deleteAction("/uc/api/org/delOrgUser", params);
//获取用户列表
const getUserList = (params) => postAction("/uc/api/user/getUserPage", params);
//
const addOrgUser = (params) =>
  postAction(
    `/uc/api/org/addOrgUser?userids=${params.userIds}&orgId=${params.orgId}`
  );
export {
  addUser,
  updateUser,
  resetPwd,
  delUserBatch,
  addRole,
  updateRole,
  initMenuTree,
  getMenu,
  initDeptTree,
  saveMenu,
  getAllMenuByRoleCode,
  getAllMethodByRoleCode,
  getOrgInfo,
  getOrgUser,
  delOrg,
  saveRoleAuth,
  delOrgUser,
  getUserList,
  addOrgUser,
};
