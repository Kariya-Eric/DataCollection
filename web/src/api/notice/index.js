import { getAction, deleteAction, putAction, postAction } from "../api";

const list = (params) => postAction("/uc/api/message/list", params);

export { list };
