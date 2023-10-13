<template>
  <div class="tableDiv">
    <table class="table">
      <tbody class="table-body">
        <tr class="table-list">
          <th v-for="(col, index) in columns" :key="index">
            {{ col.label }}
          </th>
        </tr>
        <tr class="table-list">
          <td
            v-for="(col, index) in columns.length"
            :key="index"
            :class="{
              selected: selectedCells.includes((col - 1) * columns.length + col - 1)
            }"
            @mousedown="handleCellMousedown(col)"
          >
            <table-cell :column="columns[index]" :placeholder="columns[index].label" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableCell from './table-cell'
// 浮动表单设计组件
export default {
  name: 'FixedTable',
  props: ['selectedCol', 'columns'],
  components: {
    TableCell
  },
  data() {
    return {
      selectedCells: []
    }
  },
  watch: {
    selectedCol(val) {
      this.selectedCells = []
      for (let i = 0; i < this.columns.length; i++) {
        let cellIndex = i * this.columns.length + val - 1
        this.selectedCells.push(cellIndex)
      }
    }
  },
  methods: {
    handleCellMousedown(col) {
      this.$emit('select', col)
      this.selectedCells = []
      for (let i = 0; i < this.columns.length; i++) {
        let cellIndex = i * this.columns.length + col - 1
        this.selectedCells.push(cellIndex)
      }
    }
  }
}
</script>

<style scoped lang="less">
.table {
  border-collapse: collapse;
  width: 100%;
  .table-body {
    cursor: pointer;
    .table-list {
      height: 46px;
      line-height: 46px;
      td {
        padding: 0 10px;
        border: 1px solid #dfe6ec;
        min-width: 220px;
        &.selected {
          background: #d4e7f5;
        }
      }
      th {
        padding: 0 10px;
        border: 1px solid #dfe6ec;
        min-width: 220px;
        &.selected {
          background: #d4e7f5;
        }
      }
    }
  }
}

.tableDiv {
  overflow-x: auto;
}
</style>
