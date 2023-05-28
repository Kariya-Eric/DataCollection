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
const initTree = (params) => getAction("/uc/api/sysMenu/getTree", params);

export {
  addUser,
  updateUser,
  resetPwd,
  delUserBatch,
  addRole,
  updateRole,
  initTree,
};
