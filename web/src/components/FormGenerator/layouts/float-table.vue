<template>
  <div class="tableDiv">
    <table class="table">
      <tbody class="table-body">
        <tr class="table-list" v-for="(row, index) in theaders" :key="index">
          <th
            :rowspan="head.rowspan"
            :colspan="head.colspan"
            v-for="(head, index) in row"
            :key="index"
          >
            {{ head.title }}
          </th>
        </tr>
        <!-- 标题列 -->
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
              selected: selectedCells.includes(
                (col - 1) * columns.length + col - 1
              ),
            }"
            @mousedown="handleCellMousedown(col)"
          >
            <table-cell :column="columns[index]" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableCell from "./table-cell";
import { buildFloatHeader } from "../utils/float";
// 浮动表单设计组件
export default {
  name: "FloatTable",
  props: ["selectedCol", "columns", "extra", "mergeCells"],
  components: {
    TableCell,
  },
  data() {
    return {
      selectedCells: [],
    };
  },
  watch: {
    selectedCol(val) {
      this.selectedCells = [];
      if (val != -1) {
        for (let i = 0; i < this.columns.length; i++) {
          let cellIndex = i * this.columns.length + val - 1;
          this.selectedCells.push(cellIndex);
        }
      }
    },
  },
  computed: {
    theaders() {
      return buildFloatHeader(this.extra, this.mergeCells);
    },
  },
  methods: {
    handleCellMousedown(col) {
      this.$emit("select", col);
      this.selectedCells = [];
      for (let i = 0; i < this.columns.length; i++) {
        let cellIndex = i * this.columns.length + col - 1;
        this.selectedCells.push(cellIndex);
      }
    },
  },
};
</script>

<style scoped lang="scss">
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
  //width: 1120px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
