import { getAction, postAction, deleteAction, putAction } from "../../api";

const initDeptTree = (params) =>
  getAction(`/uc/api/org/getOrgTree?userId=${params}`);

const addOrg = (params) => postAction("/uc/api/org/addOrg", params);

const delOrg = (params) => deleteAction("/uc/api/org/remove", params);

const updateOrg = (params) => putAction("/uc/api/org/updateOrg", params);

const getOrgUser = (params) =>
  getAction(
    `/uc/api/org/getOrgUser/${params.orgId}?keyword=${params.keyWord}&roleId=${params.roleId}`
  );

const delOrgUser = (params) => deleteAction("/uc/api/org/delOrgUser", params);

const getOrg = (params) => getAction(`/uc/api/org/get/${params}`);

export {
  initDeptTree,
  addOrg,
  delOrg,
  updateOrg,
  getOrgUser,
  delOrgUser,
  getOrg,
};
