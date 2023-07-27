import { getAction, deleteAction, putAction, postAction } from "../api";

const list = (params) => postAction("/uc/api/message/list", params);
const getNumber = (params) =>
  getAction("/uc/api/message/getWaitReadCount", params);
const pushNotice = (params) =>
  postAction("/uc/api/message/pushMessage", params);
const read = (params) => getAction(`/uc/api/message/read?id=${params}`);

export { list, getNumber, pushNotice, read };
