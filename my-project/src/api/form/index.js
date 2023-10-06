import { getAction, deleteAction, putAction, postAction, downFile } from '../api'

//新增表单合集
const addFormCollection = params => postAction('/uc/api/formCollection/add', params)
//修改表单合集
const updateFormCollection = params => putAction('/uc/api/formCollection/update', params)

const enableCollection = params => putAction('/uc/api/formCollection/enable', params)

//根据id获取表单大类，不包分页
const listFormCategories = params => postAction(`/uc/api/formCategories/listAll/${params}`)

const enableForm = params => putAction('/uc/api/form/enable', params)

export { addFormCollection, updateFormCollection, enableCollection, listFormCategories, enableForm }
