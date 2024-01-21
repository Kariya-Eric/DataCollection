import { getAction, postAction } from '../api'
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
  getConfigList: id => getAction(`/uc/api/dataWarehouse/getConfigList/${id}`)
}
