<template>
  <el-card shadow="always" class="app-card">
    <vxe-table
      resizable
      ref="xTable"
      border
      show-overflow
      highlight-hover-row
      :loading="loading"
      :edit-rules="validRules"
      :edit-config="{ trigger: 'click', mode: 'row' }"
      :data="tableData"
    >
      <vxe-table-column
        type="seq"
        title="序号"
        fixed="left"
        width="60"
      ></vxe-table-column>
      <vxe-table-column
        field="name"
        title="数量"
        :edit-render="{ type: 'default' }"
      >
        <template v-slot:edit="scope">
          <el-input
            placeholder="请输入数量"
            v-model="scope.row.name"
            style="width: 100px"
          ></el-input>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="date"
        title="日期"
        :edit-render="{ type: 'default' }"
      >
        <template v-slot:edit="scope">
          <el-date-picker
            v-model="scope.row.date"
            type="date"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="status"
        title="是否"
        :edit-render="{ type: 'default' }"
      >
        <template v-slot:edit="scope">
          <el-radio-group v-model="scope.row.status">
            <el-radio :label="0">是</el-radio>
            <el-radio :label="1">否</el-radio>
          </el-radio-group>
        </template>
      </vxe-table-column>
      <vxe-table-column field="id" title="操作" fixed="right" align="center">
        <template v-slot:default="{ row }">
          <el-button size="mini" @click="submitBtn(row)" type="primary"
            >保存</el-button
          >
          <el-button size="mini" @click="removeBtn(row)" type="primary"
            >清空</el-button
          >
        </template>
      </vxe-table-column>
    </vxe-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      tableData: [
        {
          name: "xxx",
          date: "2020-12-22",
          status: 0,
        },
      ],
      // 列表必填验证
      validRules: {
        name: [
          { required: true, message: "请输入数量" },
          { pattern: /^[+]{0,1}(\d+)$/, message: "请填写数字格式" },
        ],
        date: [{ required: true, message: "请选择日期" }],
      },
    };
  },
};
</script>

<style>
</style>