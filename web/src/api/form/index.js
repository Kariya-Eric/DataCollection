import { getAction, deleteAction, putAction, postAction } from "../api";

//新增表单合集
const addFormCollection = (params) =>
  postAction("/uc/api/formCollection/add", params);
//修改表单合集
const updateFormCollection = (params) =>
  putAction("/uc/api/formCollection/update", params);
//删除表单合集
const delFormCollection = (params) =>
  deleteAction("/uc/api/formCollection/delete", params);
//根据id获取表单列表
const getFormList = (params) =>
  postAction(`/uc/api/form/listByCollection/${params.id}`, params.searchParam);
//根据id获取表单大类
const getFormCategories = (params) =>
  postAction(
    `/uc/api/formCategories/listByCollection/${params.id}`,
    params.pageBean
  );
//修改表单大类
const updateFormCategory = (params) =>
  putAction("/uc/api/formCategories/update", params);
//新增表单大类
const addFormCategory = (params) =>
  postAction("/uc/api/formCategories/add", params);
//删除表单大类
const delFormCategory = (params) =>
  deleteAction("/uc/api/formCategories/delete", params);
//新增表单
const addForm = (params) => postAction("/uc/api/form/add", params);
//删除表单
const delForm = (params) => deleteAction("/uc/api/form/delete", params);
//修改表单
const updateForm = (params) => putAction("/uc/api/form/update", params);
//根据id获取表单大类，不包分页
const listFormCategories = (params) =>
  postAction(`/uc/api/formCategories/listAll/${params}`);
//表单合集列表
const formCollectionList = (params) =>
  postAction("/uc/api/formCollection/list", params);
const enableForm = (params) =>
  putAction("/uc/api/formCollection/enable", params);

const saveFormCategories = (params) =>
  postAction("/uc/api/formCategories/saveList", params);

export {
  addFormCollection,
  updateFormCollection,
  delFormCollection,
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
  enableForm,
  saveFormCategories,
};
