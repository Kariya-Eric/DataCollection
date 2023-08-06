<template>
  <el-dialog
    title="表头设置"
    :visible="visible"
    @close="close"
    append-to-body
    v-if="visible"
  >
    <div style="margin-bottom: 12px">
      <Mbutton @click="add" name="增加行" />
      <Mbutton @click="mergeRight" name="向右合并" />
      <Mbutton @click="mergeDown" name="向下合并" />
      <Mbutton @click="split" name="拆分单元格" />
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
      <vxe-column
        v-for="i in cols"
        :key="i"
        :field="`$${i}`"
        :edit-render="{ autofocus: '.el-input__inner' }"
      >
        <template #edit="{ row }">
          <el-input size="small" v-model="row[`$${i}`]" />
        </template>
      </vxe-column>
    </vxe-table>
    <div slot="footer">
      <Mbutton name="取消" @click="close" />
      <Mbutton type="primary" name="确定" @click="handleSubmit" />
    </div>
  </el-dialog>
</template>

<script>
// 浮动表单表头
export default {
  name: "FloatTableHeader",
  props: ["activeData"],
  data() {
    return {
      visible: false,
      tableData: [],
      cols: 0,
      mergeCells: [],
      selectedRow: -1,
      selectedCol: -1,
    };
  },
  methods: {
    show() {
      this.tableData = JSON.parse(JSON.stringify(this.activeData.extra));
      this.mergeCells = JSON.parse(JSON.stringify(this.activeData.mergeCells));
      this.cols = this.activeData.columns.length;
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.tableData = [];
      this.mergeCells = [];
      this.selectedRow = -1;
      this.selectedCol = -1;
    },

    async add() {
      const $table = this.$refs.xTable;
      const newRecord = {};
      await $table.insertAt(newRecord, -1);
      this.tableData = $table.getTableData().tableData;
      this.mergeCells = JSON.parse(JSON.stringify(this.mergeCells));
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

    split() {
      let checked = this.checkSplit();
      if (!checked.flag) {
        this.$message.warning(checked.msg);
        return;
      }
      let cell = checked.selectedCel;
      this.mergeCells = this.mergeCells.filter((c) => c != cell);
    },

    mergeRight() {
      let checked = this.checkMergeRight();
      if (!checked.flag) {
        this.$message.warning(checked.msg);
        return;
      }
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
    },

    mergeDown() {
      let checked = this.checkMergeDown();
      if (!checked.flag) {
        this.$message.warning(checked.msg);
        return;
      }
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
    },

    //点击向右合并后的校验
    checkMergeDown() {
      if (this.selectedRow == -1) {
        return { flag: false, msg: "请选择一个单元格！" };
      }
      if (this.selectedRow == this.tableData.length - 1) {
        return { flag: false, msg: "已经为最后一行，无法合并！" };
      }
      let selectCel = this.mergeCells.filter(
        (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
      );
      if (selectCel.length > 0) {
        //mergecell中包含
      } else {
        //mergeCells中不包含，点击的一个未合并过的单元格,判断点击的单元格下方单元格是否合并
      }
      return { flag: true, msg: "" };
    },

    //点击向右合并后的校验
    checkMergeRight() {
      if (this.selectedRow == -1) {
        return { flag: false, msg: "请选择一个单元格！" };
      }
      if (this.selectedCol == this.cols - 1) {
        return { flag: false, msg: "已经为最后一列，无法合并" };
      }
      let selectCel = this.mergeCells.filter(
        (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
      );
      if (selectCel.length > 0) {
        //mergecell中包含
      } else {
        //mergeCells中不包含，点击的一个未合并过的单元格,判断点击的单元格下方单元格是否合并
      }
      return { flag: true, msg: "" };
    },

    checkSplit() {
      let selectCel = this.mergeCells.filter(
        (cell) => cell.row == this.selectedRow && cell.col == this.selectedCol
      );
      if (selectCel.length > 0) {
        return { flag: true, selectedCel: selectCel[0] };
      } else {
        return { flag: false, msg: "已是最小单元格，无法继续拆分！" };
      }
    },

    handleSubmit() {
      this.activeData.extra = this.tableData;
      this.activeData.mergeCells = this.mergeCells;
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .vxe-table .vxe-body--column.col-select {
  background-color: #d4e7f5;
}
</style>
