import { getAction } from '../api'
export default {
  // 获取报表数据详情
  getReport: params => getAction('/uc/api/upload/getReport', params),
}
