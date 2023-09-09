import { getAction, deleteAction, putAction, postAction, downFile } from '../api'

//新增表单合集
const addFormCollection = params => postAction('/uc/api/formCollection/add', params)

//修改表单合集
const updateFormCollection = params => putAction('/uc/api/formCollection/update', params)
//根据id获取表单列表
const getFormList = params => postAction(`/uc/api/form/listByCollection/${params.id}`, params.searchParam)
//根据id获取表单大类
const getFormCategories = params => postAction(`/uc/api/formCategories/listByCollection/${params.id}`, params.pageBean)
//修改表单大类
const updateFormCategory = params => putAction('/uc/api/formCategories/update', params)
//新增表单大类
const addFormCategory = params => postAction('/uc/api/formCategories/add', params)
//删除表单大类
const delFormCategory = params => deleteAction('/uc/api/formCategories/delete', params)
//新增表单
const addForm = params => postAction('/uc/api/form/add', params)
//删除表单
const delForm = params => deleteAction('/uc/api/form/delete', params)
//修改表单
const updateForm = params => putAction('/uc/api/form/update', params)
//根据id获取表单大类，不包分页
const listFormCategories = params => postAction(`/uc/api/formCategories/listAll/${params}`)
//表单合集列表
const formCollectionList = params => postAction('/uc/api/formCollection/list', params)
const enableCollection = params => putAction('/uc/api/formCollection/enable', params)

const saveFormCategories = params => postAction('/uc/api/formCategories/saveList', params)

//复制表单
const copyForm = params => postAction(`/uc/api/form/copyForm?formCollectionId=${params.formCollectionId}&formIds=${params.formIds}`)

const addRule = params => postAction('/uc/api/formVerification/add', params)

const updateRule = params => putAction('/uc/api/formVerification/update', params)

//==========================================================================================

//上传指南
const updateGuide = params => putAction('/uc/api/formCollection/updateGuid', params)

const enableForm = params => putAction('/uc/api/form/enable', params)

export {
  addFormCollection,
  updateFormCollection,
  getFormList,
  getFormCategories,
  updateFormCategory,
  addFormCategory,
  delFormCategory,
  addForm,
  delForm,
  updateForm,
  listFormCategories,
  formCollectionList,
  enableCollection,
  saveFormCategories,
  copyForm,
  addRule,
  updateRule,
  updateGuide,
  enableForm
}
