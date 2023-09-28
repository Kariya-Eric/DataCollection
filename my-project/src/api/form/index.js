import { getAction, deleteAction, putAction, postAction, downFile } from '../api'

//新增表单合集
const addFormCollection = params => postAction('/uc/api/formCollection/add', params)
//修改表单合集
const updateFormCollection = params => putAction('/uc/api/formCollection/update', params)

export { addFormCollection, updateFormCollection }
