import { getAction, deleteAction, putAction, postAction } from "../api";

//初始化任务
const initTask = (params) => getAction("/uc/api/task/init", params);

export { initTask };
