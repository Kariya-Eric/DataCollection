<template>
  <div class="tableDiv">
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
            <template v-if="columns[colIndex].type === 'input'">
              <el-input
                :placeholder="`请输入${columns[colIndex].label}`"
                :maxlength="columns[colIndex].maxlength"
                clearable
                size="small"
              />
            </template>
            <template v-if="columns[colIndex].type === 'inputarea'">
              <el-input
                type="textarea"
                clearable
                :autosize="{
                  maxRows: columns[colIndex].maxRows,
                  minRows: columns[colIndex].minRows,
                }"
                :placeholder="`请输入${columns[colIndex].label}`"
                :maxlength="columns[colIndex].maxlength"
              />
            </template>
            <template v-if="columns[colIndex].type === 'inputnumber'">
              <custom-number
                style="width: 100%"
                :value="datasource"
                :disabled="false"
                :precision="columns[colIndex].precision"
                :min="columns[colIndex].min"
                :max="columns[colIndex].max"
              />
            </template>
            <template v-if="columns[colIndex].type === 'mail'">
              <custom-mail
                style="width: 100%"
                :value="datasource"
                :readonly="false"
                :disabled="false"
                :placeholder="`请输入${columns[colIndex].label}`"
              />
            </template>
            <template v-if="columns[colIndex].type === 'phone'">
              <custom-phone
                style="width: 100%"
                :value="datasource"
                :readonly="false"
                :isMobile="columns[colIndex].isMobile"
                :disabled="false"
                :placeholder="`请输入${columns[colIndex].label}`"
              />
            </template>
            <template v-if="columns[colIndex].type === 'address'">
              <custom-address
                style="width: 100%"
                :value="datasource"
                :disabled="false"
                :placeholder="`请输入${columns[colIndex].label}`"
              />
            </template>
            <template v-if="columns[colIndex].type === 'select'">
              <el-select
                v-model="datasource"
                size="small"
                style="width: 100%"
                :placeholder="`请选择${columns[colIndex].label}`"
              >
                <el-option
                  v-for="(item, index) in columns[colIndex].options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <template v-if="columns[colIndex].type === 'datepick'">
              <el-date-picker
                v-model="datasource"
                :placeholder="`请选择${columns[colIndex].label}`"
                size="small"
                style="width: 100%"
              ></el-date-picker>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "CustomEditTable",
  props: ["row", "col", "columns", "selectedCol"],
  watch: {
    row(val) {
      this.rows = val;
    },
    col(val) {
      this.cols = val;
    },
    columns(val) {},
    selectedCol(val) {
      this.selectedCells = [];
      for (let i = 0; i < this.rows; i++) {
        let cellIndex = i * this.cols + val - 1;
        this.selectedCells.push(cellIndex);
      }
    },
  },
  data() {
    return {
      datasource: "",
      rows: this.row,
      cols: this.col,
      selectedCells: [],
    };
  },
  methods: {
    handleCellMousedown(col) {
      this.$emit("select", col);
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
