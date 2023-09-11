import * as dcTypes from './dcTypes'
import { installCell, mapCell } from './install'
import DCVxeTable from './components/DCVxeTable'

import DCVxeSlotCell from './components/cells/DCVxeSlotCell'
import DCVxeNormalCell from './components/cells/DCVxeNormalCell.vue'
import DCVxeInputCell from './components/cells/DCVxeInputCell.vue'
import DCVxeDateCell from './components/cells/DCVxeDateCell.vue'
import DCVxeSelectCell from './components/cells/DCVxeSelectCell.vue'
import DCVxeCheckboxCell from './components/cells/DCVxeCheckboxCell.vue'
import DCVxeTextareaCell from './components/cells/DCVxeTextareaCell.vue'
import DCVxeDragSortCell from './components/cells/DCVxeDragSortCell.vue'
import DCVxeTimeCell from './components/cells/DCVxeTimeCell.vue'
import DCVxeProgressCell from './components/cells/DCVxeProgressCell.vue'
import { TagsInputCell, TagsSpanCell } from './components/cells/DCVxeTagsCell'

// 组件类型
export const DCVXETypes = dcTypes.DCVXETypes

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
  ...mapCell(DCVXETypes.textarea, DCVxeTextareaCell),
  ...mapCell(DCVXETypes.time, DCVxeTimeCell),
  ...mapCell(DCVXETypes.progress, DCVxeProgressCell),
  ...mapCell(DCVXETypes.rowDragSort, DCVxeDragSortCell),
  ...mapCell(DCVXETypes.tags, TagsInputCell, TagsSpanCell),
  ...mapCell(DCVXETypes.slot, DCVxeSlotCell)
}

export { installCell, mapCell }

export default DCVxeTable
