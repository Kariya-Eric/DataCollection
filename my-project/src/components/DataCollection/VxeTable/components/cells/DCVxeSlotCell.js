import DCVxeCellMixins from '../../mixins/DCVxeCellMixins'

// 插槽
export default {
  name: 'DCVxeSlotCell',
  mixins: [DCVxeCellMixins],
  computed: {
    slotProps() {
      return {
        value: this.innerValue,
        row: this.row,
        column: this.originColumn,

        params: this.params,
        $table: this.params.$table,
        rowId: this.params.rowid,
        index: this.params.rowIndex,
        rowIndex: this.params.rowIndex,
        columnIndex: this.params.columnIndex,

        target: this.renderOptions.target,
        caseId: this.renderOptions.target.caseId,
        scrolling: this.renderOptions.scrolling,
        reloadEffect: this.renderOptions.reloadEffect,

        triggerChange: v => this.handleChangeCommon(v)
      }
    }
  },
  render(h) {
    let { slot } = this.renderOptions
    if (slot) {
      return h('div', {}, slot(this.slotProps))
    } else {
      return h('div')
    }
  },
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    switches: {
      editRender: false
    }
  }
}
