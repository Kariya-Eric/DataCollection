<template>
  <vxe-table
    border
    ref="xTable"
    align="center"
    size="medium"
    resizable
    keep-source
    show-overflow
    :edit-config="{ trigger: 'click', mode: 'cell' }"
  >
    <vxe-column type="seq" width="60"></vxe-column>
    <vxe-column
      v-for="(col, index) in columns"
      :key="index"
      :field="col.props"
      :title="col.label"
      :edit-render="{ autofocus: '.el-input__inner' }"
    >
      <template #edit="scope">
        <el-input v-model="scope.row[col.props]"></el-input>
      </template>
    </vxe-column>
    <vxe-column title="操作" width="100" show-overflow>
      <template #default="{ row }">
        <el-popconfirm title="确认删除该行吗？" @confirm="deleteRow(row)">
          <a href="javascript:;" slot="reference">删除</a>
        </el-popconfirm>
      </template>
    </vxe-column>
  </vxe-table>
</template>

<script>
// 用于渲染的vxe表格
export default {
  name: "FormTable",
  props: ["columns", "value", "required"],
  data() {
    return {};
  },
  methods: {
    deleteRow(row) {},
  },
};
</script>

<style lang="sass" scoped>
</style>