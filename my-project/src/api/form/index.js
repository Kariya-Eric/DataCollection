import { getAction, deleteAction, putAction, postAction, downFile } from '../api'

//新增表单合集
const addFormCollection = params => postAction('/uc/api/formCollection/add', params)
//修改表单合集
const updateFormCollection = params => putAction('/uc/api/formCollection/update', params)
const enableCollection = params => putAction('/uc/api/formCollection/enable', params)
//根据id获取表单大类，不包分页
const listFormCategories = params => postAction(`/uc/api/formCategories/listAll/${params}`)
const enableForm = params => putAction('/uc/api/form/enable', params)
//新增表单
const addForm = params => postAction('/uc/api/form/add', params)
//删除表单
const delForm = params => deleteAction('/uc/api/form/delete', params)
//修改表单
const updateForm = params => putAction('/uc/api/form/update', params)
//表单合集列表
const formCollectionList = params => postAction('/uc/api/formCollection/list', params)
//根据id获取表单列表
const getFormList = params => postAction(`/uc/api/form/listByCollection/${params.id}`, params.searchParam)
//复制表单
const copyForm = params => postAction(`/uc/api/form/copyForm?formCollectionId=${params.formCollectionId}&formIds=${params.formIds}`)
//根据id获取表单大类
const getFormCategories = params => postAction(`/uc/api/formCategories/listByCollection/${params.id}`, params.pageBean)
const saveFormCategories = params => postAction('/uc/api/formCategories/saveList', params)
//上传指南
const updateGuide = params => putAction('/uc/api/formCollection/updateGuid', params)
export {
  addFormCollection,
  updateFormCollection,
  enableCollection,
  listFormCategories,
  enableForm,
  addForm,
  delForm,
  updateForm,
  formCollectionList,
  getFormList,
  copyForm,
  getFormCategories,
  saveFormCategories,
  updateGuide
}
