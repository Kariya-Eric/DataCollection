// 组件类型
export default DCVXETypes
export const DCVXETypes = {
  // 为了防止和 vxe 内置的类型冲突，所以加上一个前缀
  _prefix: 'dc-',

  // 行号列
  rowNumber: 'row-number',
  // 选择列
  rowCheckbox: 'row-checkbox',
  // 单选列
  rowRadio: 'row-radio',
  // 展开列
  rowExpand: 'row-expand',
  // 上下排序
  rowDragSort: 'row-drag-sort',

  input: 'input',
  inputNumber: 'inputNumber',
  inputLink: 'inputLink',
  inputPhone: 'inputPhone',
  inputMail: 'inputMail',
  textarea: 'textarea',
  select: 'select',
  date: 'date',
  checkbox: 'checkbox',
  // 下拉多选
  selectMultiple: 'select-multiple',
  slot: 'slot',
  normal: 'normal',
  hidden: 'hidden'
}
