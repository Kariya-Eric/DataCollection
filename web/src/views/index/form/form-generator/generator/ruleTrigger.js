/**
 * 用于生成表单校验，指定正则规则的触发方式。
 * 未在此处声明无触发方式的组件将不生成rule！！
 */
export default {
  'el-input': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'customMail': 'blur',
  'customPhone': 'blur',
  'customAddress': 'blur',
  'customNumber':'blur'
}
