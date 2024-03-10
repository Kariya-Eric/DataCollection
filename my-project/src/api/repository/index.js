import { getAction, postAction, uploadAction, downFileString } from '../api'
export default {
  // 获取目录年份列表
  getYearList: () => getAction('/uc/api/dataWarehouse/getYearList'),
  // 根据类型和年份获取目录列表
  getListByYearAndType: params => getAction('/uc/api/dataWarehouse/getListByYearAndType', params),
  // 根据表ID获取数据列表
  getDataList: (id, params) => postAction(`/uc/api/dataWarehouse/getDataList/${id}`, params),
  // 根据表ID获取数据年份
  getDataYearList: id => getAction(`/uc/api/dataWarehouse/getDataYearList/${id}`),
  // 根据表ID获取字段属性列表
  getConfigList: id => getAction(`/uc/api/dataWarehouse/getConfigList/${id}`),
  // 根据目录ID下载导入模板
  downloadTemplate: id => postAction(`/uc/api/dataWarehouse/downloadTemplate/${id}`),
  // 数据导入
  importData: (id, params) => uploadAction(`/uc/api/dataWarehouse/importData/${id}`, params),
  // 数据导出
  exportData: (id, params) => downFileString(`/uc/api/dataWarehouse/exportData/${id}`, params)
}
