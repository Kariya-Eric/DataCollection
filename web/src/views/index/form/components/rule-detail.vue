<template>
  <div style="padding: 0px 24px 12px 24px">
    <el-row class="search-row">
      <el-col :span="24">
        <div class="search-button-admin">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addRule"
            >添加校验</el-button
          >
        </div>
      </el-col>
    </el-row>
    <el-table :data="rules">
      <el-table-column label="校验名称"></el-table-column>
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
    <rule-dialog ref="ruleDialog" />
  </div>
</template>

<script>
import RuleDialog from "./rule-dialog";
export default {
  name: "RuleDetail",
  components: { RuleDialog },
  data() {
    return {
      rules: [],
    };
  },
  methods: {
    addRule() {
      this.$refs.ruleDialog.show();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>