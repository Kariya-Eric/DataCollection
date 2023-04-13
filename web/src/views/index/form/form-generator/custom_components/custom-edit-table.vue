<template>
  <div>
    <div class="tableBtn">
      <el-button type="primary" icon="el-icon-plus" size="small" @click="addRow"
        >增加</el-button
      >
      <el-popconfirm
        icon="el-icon-info"
        icon-color="red"
        title="确认删除吗？"
        @confirm="delRow(null)"
      >
        <el-button
          slot="reference"
          v-show="multipleSelection.length > 0"
          type="danger"
          icon="el-icon-delete"
          size="small"
          >删除</el-button
        >
      </el-popconfirm>
      <el-button type="primary" icon="el-icon-upload" size="small"
        >导入</el-button
      >
    </div>
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
        <template> <slot></slot> </template>
        <!-- <el-input
            class="item"
            v-if="scope.row.isEdit"
            v-model="scope.row[item.props]"
          />
          <span v-else class="text">{{ scope.row[item.props] }}</span> -->
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.isEdit"
            type="text"
            size="small"
            @click="changeEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-else
            type="text"
            size="small"
            @click="changeEdit(scope.row)"
            >保存</el-button
          >
          <el-divider direction="vertical" />
          <el-popconfirm
            icon="el-icon-info"
            icon-color="red"
            title="确认删除吗？"
            @confirm="delRow(scope.row)"
          >
            <el-button type="text" size="small" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "CustomEditTable",
  props: ["columns"],
  data() {
    return {
      tableData: [],
      loading: false,
      multipleSelection: [],
    };
  },
  watch: {
    conf(val) {
      this.columns = val;
    },
  },
  methods: {
    addRow() {
      let tempData = {};
      this.columns.forEach((item) => {
        const props = item.props;
        tempData[props] = "";
        tempData.isEdit = false;
      });
      this.tableData.push(tempData);
    },

    changeEdit(row) {
      row.isEdit = !row.isEdit;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    delRow(row) {
      if (row) {
        this.tableData = this.tableData.filter((ele) => row !== ele);
      } else {
        this.multipleSelection.forEach(
          (ele) =>
            (this.tableData = this.tableData.filter((row) => row !== ele))
        );
      }
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
.tableBtn {
  margin: 8px 0px;
}
</style>
