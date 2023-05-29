import { getAction, deleteAction, putAction, postAction } from "../api";

//新增表单合集
const addFormCollection = (params) => postAction("/uc/api/formCollection/add", params);
//修改表单合集
const updateFormCollection = (params) => putAction('/uc/api/formCollection/update', params)
//删除表单合集
const delFormCollection = (params) => deleteAction('/uc/api/formCollection/delete', params)

export { addFormCollection, updateFormCollection, delFormCollection }