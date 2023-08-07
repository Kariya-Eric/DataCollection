<template>
  <div style="padding: 0px 24px 12px 24px">
    <Mbutton type="primary" @click="addRule" name="添加校验" />
    <el-table
      :data="dataSource"
      class="listTable"
      :header-cell-style="headerStyle"
    >
      <el-table-column label="校验名称"  prop="name" align="center" />
      <el-table-column label="校验模式"></el-table-column>
      <el-table-column label="前置表单"></el-table-column>
      <el-table-column label="校验类型"></el-table-column>
      <el-table-column label="校验失败提示信息"></el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enabled"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="javascript:;">查看</a>
          <el-divider direction="vertical" />
          <a href="javascript:;">编辑</a>
          <el-divider direction="vertical" />
          <el-popconfirm title="确认删除该校验规则吗？">
            <a href="javascript:;" slot="reference">删除</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="ipagination" @change="loadData" />
    <rule-dialog ref="ruleDialog" :drawingList="drawingList" />
  </div>
</template>

<script>
import RuleDialog from "./rule-dialog";
export default {
  name: "RuleDetail",
  components: { RuleDialog },
  props: ["drawingList", "rules"],
  watch: {
    rules(newVal) {
      this.dataSource = newVal;
    },
  },
  data() {
    return {
      dataSource: this.rules,
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
      headerStyle: {
        backgroundColor: "#F4F5F6",
      },
    };
  },
  methods: {
    addRule() {
      this.$refs.ruleDialog.show();
    },

    loadData() {},
  },
};
</script>

<style lang="scss" scoped>
</style>