import * as dcvxeTypes from './dcvxeTypes'
import { installCell, mapCell } from './install'
import DCVxeTable from './components/DCVxeTable'

import DCVxeSlotCell from './components/cells/DCVxeSlotCell'
import DCVxeNormalCell from './components/cells/DCVxeNormalCell'
import DCVxeInputCell from './components/cells/DCVxeInputCell'
import DCVxeDateCell from './components/cells/DCVxeDateCell'
import DCVxeTimeCell from './components/cells/DCVxeTimeCell'
import DCVxeSelectCell from './components/cells/DCVxeSelectCell'
import DCVxeTextareaCell from './components/cells/DCVxeTextareaCell'
import DCVxeDragSortCell from './components/cells/DCVxeDragSortCell'
import DCVxeCheckboxCell from './components/cells/DCVxeCheckboxCell'

// 组件类型
export const DCVXETypes = dcvxeTypes.DCVXETypes

// 注册自定义组件
export const AllCells = {
  ...mapCell(DCVXETypes.normal, DCVxeNormalCell),
  ...mapCell(DCVXETypes.input, DCVxeInputCell),
  ...mapCell(DCVXETypes.inputNumber, DCVxeInputCell),
  ...mapCell(DCVXETypes.checkbox, DCVxeCheckboxCell),
  ...mapCell(DCVXETypes.select, DCVxeSelectCell),
  ...mapCell(DCVXETypes.selectSearch, DCVxeSelectCell), // 下拉搜索
  ...mapCell(DCVXETypes.selectMultiple, DCVxeSelectCell), // 下拉多选
  ...mapCell(DCVXETypes.date, DCVxeDateCell),
  ...mapCell(DCVXETypes.datetime, DCVxeDateCell),
  ...mapCell(DCVXETypes.time, DCVxeTimeCell),
  ...mapCell(DCVXETypes.textarea, DCVxeTextareaCell),
  ...mapCell(DCVXETypes.rowDragSort, DCVxeDragSortCell),
  ...mapCell(DCVXETypes.slot, DCVxeSlotCell)
}

export { installCell, mapCell }

export default DCVxeTable
