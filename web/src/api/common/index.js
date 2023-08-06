import { getAction, deleteAction, putAction, postAction } from "../api";

const cityList = (params) => postAction(`/uc/api/area/list/${params}`);

export { cityList };
