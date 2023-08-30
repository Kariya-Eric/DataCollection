import { getAction, postAction, deleteAction, putAction } from "../../api";

//获取用户列表
const getUserList = (params) => postAction("/uc/api/user/getUserPage", params);
//获取用户详情
const getUserDetail = (params) => getAction(`/uc/api/user/get/${params}`);
//批量删除用户
const delUserBatch = (params) =>
  deleteAction(`/uc/api/user/deleteUserByIds`, params);
//重置密码
const resetPwd = (params) => postAction("/uc/api/user/updateUserPsw", params);
//新增用户
const addUser = (params) => postAction("/uc/api/user/addUser", params);
//修改用户
const updateUser = (params) => putAction("/uc/api/user/updateUser", params);

export {
  getUserList,
  getUserDetail,
  delUserBatch,
  resetPwd,
  addUser,
  updateUser,
};
