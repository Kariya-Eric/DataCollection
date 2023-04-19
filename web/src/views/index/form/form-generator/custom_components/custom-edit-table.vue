<template>
  <table class="table">
    <tbody class="table-body">
      <tr class="table-list" v-for="(row, index) in rows" :key="index">
        <td
          v-for="(col, index) in cols"
          :key="index"
          :class="{
            selected: selectedCells.includes((row - 1) * cols + col - 1),
          }"
          :colspan="
            layoutDetail[(row - 1) * cols + col - 1] &&
            layoutDetail[(row - 1) * cols + col - 1]['colSpan']
          "
          :rowspan="
            layoutDetail[(row - 1) * cols + col - 1] &&
            layoutDetail[(row - 1) * cols + col - 1]['rowSpan']
          "
          v-show="isNeedShow(row - 1, col - 1)"
          @mousedown="(e) => handleCellMousedown(e, row, col)"
          @mouseup="handleMouseUp"
        >
          {{ row }}--{{ col }}
          <el-dropdown @command="menuItemCmd" trigger="click">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="computedCom('mergeDown', row, col)"
                >向下合并</el-dropdown-item
              >
              <el-dropdown-item :command="computedCom('mergeRight', row, col)"
                >向右合并</el-dropdown-item
              >
              <el-dropdown-item :command="computedCom('split', row, col)"
                >拆分</el-dropdown-item
              >
              <el-dropdown-item :command="computedCom('delRow', row, col)"
                >删除行</el-dropdown-item
              >
              <el-dropdown-item :command="computedCom('delCol', row, col)"
                >删除列</el-dropdown-item
              >
              <el-dropdown-item :command="computedCom('addRow', row, col)"
                >添加行</el-dropdown-item
              >
              <el-dropdown-item :command="computedCom('addCol', row, col)"
                >添加列</el-dropdown-item
              >
              <el-dropdown-item
                :command="computedCom('clearSelection', row, col)"
                >清空选择</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "CustomEditTable",
  components: { draggable },
  watch: {
    drawingList(val) {
      console.log(val);
    },
  },
  computed: {
    layoutDetail() {
      let length = this.cols * this.rows;
      let result = [];
      for (let i = 0; i < length; i++) {
        result.push({
          colSpan: 1,
          rowSpan: 1,
        });
      }
      return result;
    },

    hiddenTdMaps() {
      let hiddenTdMaps = {};
      let rows = this.rows;
      let cols = this.cols;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (this.layoutDetail[i * cols + j]) {
            let colInfo = this.layoutDetail[i * cols + j];
            if (
              (colInfo.colSpan && colInfo.colSpan > 1) ||
              (colInfo.rowSpan && colInfo.rowSpan > 1)
            ) {
              for (let row = i; row < i + (colInfo.rowSpan || 1); row++) {
                // col = (row === i ? j + 1 : j) 是为了避开自己
                for (
                  let col = row === i ? j + 1 : j;
                  col < j + (colInfo.colSpan || 1);
                  col++
                ) {
                  hiddenTdMaps[`${row}_${col}`] = true;
                }
              }
            }
          }
        }
      }
      return hiddenTdMaps;
    },
  },
  data() {
    return {
      drawingList: [],
      cols: 3,
      rows: 3,
      selectedCells: [],
      // mousedown的时候设置为其他值 否则都是-1
      selectionHold: -1,
    };
  },
  methods: {
    isNeedShow(row, col) {
      return !this.hiddenTdMaps[`${row}_${col}`];
    },

    handleCellMousedown(e, x, y) {
      let cellIndex = (x - 1) * this.cols + y - 1;
      this.selectedCells = [cellIndex];
      // mousedown标志
      this.selectionHold = cellIndex;
    },

    handleMouseUp(e) {
      this.selectionHold = -1;
    },

    menuItemCmd(cmd) {
      switch (cmd.command) {
        case "mergeDown":
          if (cmd.row === this.rows) return;
          let index = (cmd.row - 1) * this.cols + cmd.col - 1;
          this.layoutDetail[index].rowSpan++;
          break;
        case "mergeRight":
          if (cmd.col === this.cols) return;
          break;
        case "split":
          break;
        case "delRow":
          this.rows = this.rows - 1;
          break;
        case "delCol":
          this.cols = this.cols - 1;
          break;
        case "addRow":
          this.rows = this.rows + 1;
          break;
        case "addCol":
          this.cols = this.cols + 1;
          break;
        case "clearSelection":
          this.clearSelection();
          break;
      }
    },

    clearSelection() {
      this.selectedCells = [];
    },

    computedCom(command, row, col) {
      return { command, row, col };
    },
  },
};
</script>

<style scoped lang="scss">
.table {
  border-collapse: collapse;
  width: 100%;
  .table-body {
    .table-list {
      height: 46px;
      line-height: 46px;

      td {
        padding: 0 10px;
        border: 1px solid #dfe6ec;
        cursor: pointer;
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
