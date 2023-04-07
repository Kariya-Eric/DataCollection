<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" size="small" @click="addRow"
      >增加</el-button
    >
    <el-button
      v-if="multipleSelection.length > 0"
      type="danger"
      icon="el-icon-delete"
      size="small"
      >删除</el-button
    >
    <el-button type="primary" icon="el-icon-upload" size="small"
      >导入</el-button
    >
    <el-table
      :data="tableData"
      border
      size="small"
      :loading="loading"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        v-for="(item, index) in columns"
        :label="item.label"
        :index="item.index"
        :key="index"
      >
        <template slot-scope="scope">
          <el-input
            class="item"
            v-if="scope.row.isEdit"
            v-model="scope.row[item.props]"
          />
          <span v-else class="text">{{ scope.row[item.props] }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isEdit"
            type="text"
            size="small"
            @click="changeEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            v-else
            type="text"
            size="small"
            @click="changeEdit(scope.row)"
            >保存</el-button
          >
          <el-divider direction="vertical" />
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CustomEditTable",
  props: {
    conf: {
      // 组件的config 配置
      type: Object,
    },
  },
  data() {
    return {
      columns: this.conf.__config__.columns,
      tableData: [],
      loading: false,
      multipleSelection: [],
    };
  },
  watch: {
    conf(val) {
      this.columns = val.__config__.columns;
    },
  },
  methods: {
    addRow() {
      let tempData = {};
      this.columns.forEach((item) => {
        const props = item.props;
        this.tableData.forEach((row) => {
          if (!row[props]) {
            row[props] = "";
          }
        });
        tempData[props] = "";
        tempData.isEdit = false;
      });
      this.tableData.push(tempData);
      console.log(this.tableData);
    },

    changeEdit(row) {
      row.isEdit = !row.isEdit;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style scoped lang="scss">
.item {
  width: auto;
  /deep/ .el-input__inner {
    height: 32px !important;
  }
}
.text {
  line-height: 24px;
  padding: 0 9px;
  box-sizing: border-box;
}
</style>
