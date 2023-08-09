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
//获取表单信息
const taskFormDetail = (params) =>
  getAction(`/uc/api/taskFormDetail/get/${params}`);
//任务详情-表单列表
const getTaskFormDetail = (params) =>
  postAction(
    `/uc/api/taskFormDetail/list?taskId=${params.taskId}&type=${params.type}`
  );
//表单详情-保存表单
const updateTaskFormDetail = (params) =>
  putAction("/uc/api/taskFormDetail/update", params);

const delTask = (params) => deleteAction(`/uc/api/task/delete`, params);
/*  */
const taskList = (params) => postAction(`/uc/api/task/list`, params);

const copyAuthority = (params) =>
  postAction(
    `/uc/api/taskForm/copyAuthority?taskId=${params.taskId}&sourceTaskId=${params.sourceTaskId}`
  );

const configFillStatus = (params) =>
  putAction("/uc/api/taskForm/configFillStatus", params);

const configAuthUser = (params) =>
  putAction("/uc/api/taskFormDetail/configAuthUser", params);
const approveForm = (params) =>
  putAction("/uc/api/taskFormDetail/approve", params);

const recallForm = (params) =>
  getAction(`/uc/api/taskFormDetail/recall/${params}`);

const collaborationProgress = (params) =>
  postAction(
    `/uc/api/taskFormDetail/collaborationProgress?taskFormId=${params}`
  );

const submitForm = (params) => getAction(`/uc/api/taskFormDetail/submit/${params}`)
export {
  initTask,
  updateTask,
  configEndTime,
  getTask,
  getTaskFormList,
  enableTask,
  getTaskInfo,
  configAuthority,
  taskFormDetail,
  getTaskFormDetail,
  updateTaskFormDetail,
  delTask,
  taskList,
  copyAuthority,
  configFillStatus,
  configAuthUser,
  approveForm,
  recallForm,
  collaborationProgress,
  submitForm
};
