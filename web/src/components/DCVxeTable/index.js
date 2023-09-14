import * as dcTypes from './dcTypes'
import { installCell, mapCell } from './install'
import DCVxeTable from './components/DCVxeTable'

import DCVxeSlotCell from './components/cells/DCVxeSlotCell'
import DCVxeNormalCell from './components/cells/DCVxeNormalCell.vue'
import DCVxeInputCell from './components/cells/DCVxeInputCell.vue'
import DCVxeInputNumberCell from '@/components/DCVxeTable/components/cells/DCVxeInputNumberCell.vue'
import DCVxeDateCell from './components/cells/DCVxeDateCell.vue'
import DCVxeSelectCell from './components/cells/DCVxeSelectCell.vue'
import DCVxeTextareaCell from './components/cells/DCVxeTextareaCell.vue'
import DCVxeDragSortCell from './components/cells/DCVxeDragSortCell.vue'
import DCVxeTimeCell from './components/cells/DCVxeTimeCell.vue'

// 组件类型
export const DCVXETypes = dcTypes.DCVXETypes

// 注册自定义组件
export const AllCells = {
  ...mapCell(DCVXETypes.normal, DCVxeNormalCell),
  ...mapCell(DCVXETypes.input, DCVxeInputCell),
  ...mapCell(DCVXETypes.input, DCVxeInputCell),
  ...mapCell(DCVXETypes.inputLink, DCVxeInputCell),
  ...mapCell(DCVXETypes.inputPhone, DCVxeInputCell),
  ...mapCell(DCVXETypes.inputMail, DCVxeInputCell),
  ...mapCell(DCVXETypes.inputNumber, DCVxeInputNumberCell),
  ...mapCell(DCVXETypes.select, DCVxeSelectCell),
  ...mapCell(DCVXETypes.selectMultiple, DCVxeSelectCell), // 下拉多选
  ...mapCell(DCVXETypes.date, DCVxeDateCell),
  ...mapCell(DCVXETypes.datetime, DCVxeDateCell),
  ...mapCell(DCVXETypes.textarea, DCVxeTextareaCell),
  ...mapCell(DCVXETypes.time, DCVxeTimeCell),
  ...mapCell(DCVXETypes.rowDragSort, DCVxeDragSortCell),
  ...mapCell(DCVXETypes.slot, DCVxeSlotCell)
}

export { installCell, mapCell }

export default DCVxeTable
