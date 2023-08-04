<template>
  <el-dialog title="表头设置" :visible="visible" @close="close" append-to-body>
    <div style="margin-bottom: 12px">
      <Mbutton @click="add" name="增加行" />
      <Mbutton @click="mergeRight" name="向右合并" v-if="mergeRightVisible" />
      <Mbutton @click="mergeDown" name="向下合并" v-if="mergeDownVisible" />
      <Mbutton @click="split" name="拆分单元格" v-if="splitVisible" />
    </div>
    <vxe-table
      border
      ref="xTable"
      :show-header="false"
      align="center"
      :merge-cells="mergeCells"
      :data="tableData"
      :cell-class-name="cellClassName"
      :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      @cell-click="clickCell"
    >
      <vxe-column v-for="i in cols" :key="i" :field="`$${i}`" :edit-render="{}">
        <template #edit="{ row }">
          <el-input size="small" v-model="row[`$${i}`]" />
        </template>
      </vxe-column>
    </vxe-table>
  </el-dialog>
</template>

<script>
// 浮动表单表头
export default {
  name: "FloatTableHeader",
  props: ["headers", "cols"],
  data() {
    return {
      visible: false,
      tableData: [],
      mergeCells: [],
      selectedRow: -1,
      selectedCol: -1,
    };
  },
  computed: {
    mergeDownVisible() {
      if (
        this.selectedRow == -1 ||
        this.selectedRow == this.tableData.length - 1
      ) {
        return false;
      }
      if (
        this.mergeCells.filter(
          (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
        ).length > 0
      ) {
        let cell = this.mergeCells.filter(
          (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
        )[0];
        if (cell.rowspan == this.tableData.length) {
          return false;
        }
      }
      return true;
    },
    mergeRightVisible() {
      if (this.selectedCol == -1 || this.selectedCol == this.cols - 1) {
        return false;
      }
      if (
        this.mergeCells.filter(
          (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
        ).length > 0
      ) {
        let cell = this.mergeCells.filter(
          (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
        )[0];
        if (cell.colspan == this.cols) {
          return false;
        }
      }
      return true;
    },
    splitVisible() {
      if (
        this.mergeCells.filter(
          (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
        ).length > 0
      ) {
        return true;
      }
      return false;
    },
  },

  methods: {
    show() {
      this.visible = true;
    },

    close() {
      this.visible = false;
    },

    async add() {
      const $table = this.$refs.xTable;
      const newRecord = {};
      await $table.insertAt(newRecord, -1);
      this.tableData = $table.getTableData().tableData;
    },

    //处理选中的单元格
    clickCell({ rowIndex, columnIndex }) {
      this.selectedCol = columnIndex;
      this.selectedRow = rowIndex;
    },

    //处理样式
    cellClassName({ rowIndex, columnIndex }) {
      if (this.selectedCol == columnIndex && this.selectedRow == rowIndex) {
        return "col-select";
      }
      return null;
    },

    split() {},

    mergeRight() {
      let flag = false;
      this.mergeCells.forEach((cell) => {
        if (cell.row == this.selectedRow && cell.col == this.selectedCol) {
          cell.colspan += 1;
          this.mergeCells = JSON.parse(JSON.stringify(this.mergeCells));
          flag = true;
        }
      });
      if (!flag) {
        let merge = {
          row: this.selectedRow,
          col: this.selectedCol,
          rowspan: 1,
          colspan: 2,
        };
        this.mergeCells.push(merge);
      }
      console.log("1", this.mergeCells);
    },

    mergeDown() {
      let flag = false;
      this.mergeCells.forEach((cell) => {
        if (cell.row == this.selectedRow && cell.col == this.selectedCol) {
          cell.rowspan += 1;
          this.mergeCells = JSON.parse(JSON.stringify(this.mergeCells));
          flag = true;
        }
      });
      if (!flag) {
        let merge = {
          row: this.selectedRow,
          col: this.selectedCol,
          rowspan: 2,
          colspan: 1,
        };
        this.mergeCells.push(merge);
      }
      console.log("1", this.mergeCells);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .vxe-table .vxe-body--column.col-select {
  background-color: #d4e7f5;
}
</style>
