import { getAction, postAction, deleteAction } from "../../api";

//获取用户列表
const getUserList = (params) => postAction("/uc/api/user/getUserPage", params);
//获取用户详情
const getUserDetail = (params) => getAction(`/uc/api/user/get/${params}`);
//批量删除用户
const delUserBatch = (params) =>
  deleteAction(`/uc/api/user/deleteUserByIds`, params);
//重置密码
const resetPwd = (params) => postAction("/uc/api/user/updateUserPsw", params);

export { getUserList, getUserDetail, delUserBatch, resetPwd };
