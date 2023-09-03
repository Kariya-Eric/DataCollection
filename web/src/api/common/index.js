import { postAction, uploadAction, downFile } from "../api";

const cityList = (params) => postAction(`/uc/api/area/list/${params}`);
const fileUpload = (params) => uploadAction("/uc/api/file/fileUpload", params);
const downloadTemp = (params) => downFile(`${params}`);

export { cityList, fileUpload, downloadTemp };
