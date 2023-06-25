import { getAction, deleteAction, putAction, postAction } from "../api";

//初始化任务
const initTask = (params) => getAction("/uc/api/task/init", params);
//修改保存任务
const updateTask = (params) => putAction("/uc/api/task/update", params);
//批量配置统计截止时间
const configEndTime = (params) =>
  putAction("/uc/api/taskForm/configEndTime", params);
//获取任务详情
const getTask = (params) => getAction(`/uc/api/task/get/${params}`);
//表单配置列表&权限配置列表
const getTaskFormList = (params) =>
  postAction(
    `/uc/api/taskForm/list?taskId=${params.taskId}&formCollectionId=${params.formCollectionId}`
  );
//启用任务
const enableTask = (params) => putAction("/uc/api/task/enable", params);
//获取任务信息
const getTaskInfo = (params) => getAction(`/uc/api/task/get/${params}`);
//配置权限
const configAuthority = (params) =>
  putAction("/uc/api/taskForm/configAuthority", params);
  
export {
  initTask,
  updateTask,
  configEndTime,
  getTask,
  getTaskFormList,
  enableTask,
  getTaskInfo,
  configAuthority,
};
