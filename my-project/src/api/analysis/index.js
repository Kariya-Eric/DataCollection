import { getAction, postAction, downFileString } from '../api'
export default {
  // 获取报表数据详情
  getReport: params => getAction('/uc/api/upload/getReportData', params),
  // 导出报告
  exportReport: params => downFileString('/uc/api/upload/export', params),
  // 获取专业列表
  getSubjects: params => postAction('/uc/api/subject/listAll', params)
}