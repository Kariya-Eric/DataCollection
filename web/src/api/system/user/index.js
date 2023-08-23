import { getAction, postAction, deleteAction } from "../../api";

//获取用户列表
const getUserList = (params) => postAction("/uc/api/user/getUserPage", params);
//获取用户详情
const getUserDetail = (params) => getAction(`/uc/api/user/get/${params}`);

const delUserBatch = (params) =>
  deleteAction(`/uc/api/user/deleteUserByIds`, params);
  
export { getUserList, getUserDetail, delUserBatch };
