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

export { initTask, updateTask, configEndTime, getTask };
