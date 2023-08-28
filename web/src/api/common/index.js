import { postAction, uploadAction, downFile } from "../api";

const cityList = (params) => postAction(`/uc/api/area/list/${params}`);
const fileUpload = (url, params) => uploadAction(`${url}`, params);
const downloadTemp = (params) => downFile(`${params}`)

export { cityList, fileUpload, downloadTemp };
