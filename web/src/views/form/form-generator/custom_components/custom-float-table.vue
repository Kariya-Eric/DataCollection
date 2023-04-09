<template>
  <div>
    <!-- <el-row v-for="item in row" :key="item" type="flex">
      <el-col v-for="item in col" :key="item">
        <div class="inner" @click="show(item)"></div>
      </el-col>
    </el-row> -->
    <table class="innerTable">
      <tr v-for="(row, index) in tableData" :key="index">
        <td
          v-for="col in row"
          :key="col.id"
          @click="show(col)"
          :class="{ active: col.selected }"
          :rowspan="col.rowspan"
          :colspan="col.colspan"
        ></td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "CustomFloatTable",
  props: {
    conf: {
      // 组件的config 配置
      type: Object,
    },
  },
  watch: {
    conf(val) {
      console.log(val);
      this.tableData = val.__config__.tableData;
    },
  },
  data() {
    return {
      tableData: this.conf.__config__.tableData,
    };
  },
  methods: {
    show(col) {
      console.log(col);
    },
  },
};
</script>

<style lang="scss" scoped>
.innerTable {
  width: 100%;
  border: solid 1px;
  border-collapse: collapse;
  border-spacing: 0;
  margin: 8px 0px;
  td {
    padding: 5px;
    border: solid 1px;
    height: 48px;
  }
  .active {
    color: red;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>
