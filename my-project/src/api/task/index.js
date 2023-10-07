import { getAction, deleteAction, putAction, postAction, downFile } from '../api'
//启用任务
const enableTask = params => putAction('/uc/api/task/enable', params)
//获取任务信息
const getTaskInfo = params => getAction(`/uc/api/task/get/${params}`)

//表单配置列表&权限配置列表
const getTaskFormList = params => postAction(`/uc/api/taskForm/list?taskId=${params.taskId}&formCollectionId=${params.formCollectionId}`)
export { enableTask, getTaskFormList, getTaskInfo }
