import { postAction, uploadAction } from "../api";

const cityList = (params) => postAction(`/uc/api/area/list/${params}`);

const fileUpload = (params) => uploadAction("/uc/api/file/fileUpload", params);

export { cityList, fileUpload };
