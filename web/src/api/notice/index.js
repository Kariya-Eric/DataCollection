import { getAction, deleteAction, putAction, postAction } from "../api";

const list = (params) => postAction("/uc/api/message/list", params);
const getNumber = (params) =>
  getAction("/uc/api/message/getWaitReadCount", params);
export { list, getNumber };
