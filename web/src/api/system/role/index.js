import { getAction, postAction, deleteAction } from "../../api";

const getRoleList = (params) => postAction("/uc/api/role/getRolePage", params);

export { getRoleList };
