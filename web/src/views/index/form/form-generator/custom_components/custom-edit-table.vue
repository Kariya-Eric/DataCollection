<template>
  <div>
    <table class="table">
      <tbody class="table-body">
        <tr class="table-list">
          <th v-for="(column, index) in columns" :key="index">
            {{ column.label }}
          </th>
        </tr>
        <tr class="table-list">
          <td
            v-for="(col, colIndex) in cols"
            :key="colIndex"
            :class="{
              selected: selectedCells.includes((row - 1) * cols + col - 1),
            }"
            @mousedown="handleCellMousedown(col)"
          >
            {{ row }}--{{ col }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "CustomEditTable",
  components: { draggable },
  props: ["row", "col", "columns"],
  watch: {
    row(val) {
      this.rows = val;
    },
    col(val) {
      this.cols = val;
    },
  },
  data() {
    return {
      rows: this.row,
      cols: this.col,
      selectedCells: [],
    };
  },
  methods: {
    handleCellMousedown(col) {
      this.$emit("input", col);
      this.selectedCells = [];
      for (let i = 0; i < this.rows; i++) {
        let cellIndex = i * this.cols + col - 1;
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

        &.selected {
          background: #d4e7f5;
        }
      }
      th {
        padding: 0 10px;
        border: 1px solid #dfe6ec;

        &.selected {
          background: #d4e7f5;
        }
      }
    }
  }
}
</style>
