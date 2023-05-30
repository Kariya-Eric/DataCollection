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
const initDeptTree = (params) => getAction(`/uc/api/org/getOrgTree?userId=${params}`);

export {
  addUser,
  updateUser,
  resetPwd,
  delUserBatch,
  addRole,
  updateRole,
  initMenuTree,
  getMenu,
  initDeptTree
};
