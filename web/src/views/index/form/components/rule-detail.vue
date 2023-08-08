<template>
  <div class="ruleDiv">
    <mbutton type="primary" @click="addRule" name="添加校验" />
    <el-table
      v-loading="loading"
      :data="dataSource"
      class="listTable"
      :header-cell-style="headerStyle"
    >
      <el-table-column label="校验名称" prop="name" align="center" />
      <el-table-column label="校验模式">
        <template slot-scope="scope">
          <span>
            {{ scope.row.verifyMode == "current" ? "表内校验" : "表间校验" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="前置表单"></el-table-column>
      <el-table-column label="校验类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 'dataRange'">数据范围校验</span>
          <span v-else-if="scope.row.type == 'unique'">唯一性校验</span>
          <span v-else-if="scope.row.type == 'exclusivity'">排他性校验</span>
          <span v-else-if="scope.row.type == 'consistency'">一致性校验</span>
          <span v-else-if="scope.row.type == 'dateTime'">时间日期校验</span>
          <span v-else>自定义校验</span>
        </template>
      </el-table-column>
      <el-table-column label="校验失败提示信息">
        <template slot-scope="scope">
          <ellipsis v-model="scope.row.message" />
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch
            disabled
            v-model="scope.row.enabledFlag"
            :inactive-value="0"
            :active-value="1"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220px" align="center">
        <template slot-scope="scope">
          <menu-link @click="updateRule(scope.row)">查看</menu-link>
          <el-popconfirm
            title="确认删除该校验规则吗？"
            @confirm="delRule(scope.row)"
          >
            <a href="javascript:;" slot="reference">删除</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pagination="ipagination" @change="loadData" />
    <rule-dialog
      ref="ruleDialog"
      :drawingList="drawingList"
      :formId="formId"
      @refresh="loadData"
    />
  </div>
</template>

<script>
import RuleDialog from "./rule-dialog";
import { delRule } from "@/api/form";
export default {
  name: "RuleDetail",
  components: { RuleDialog },
  props: ["drawingList", "rules", "formId"],
  watch: {
    rules(newVal) {
      this.dataSource = newVal;
    },
  },
  data() {
    return {
      loading: false,
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

    loadData() {
      let pageBean = {
        page: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        showTotal: true,
      };
      this.$emit("page", pageBean);
    },

    delRule(row) {
      let param = "id=" + row.id;
      this.loading = true;
      delRule(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    updateRule(row) {
      this.$refs.ruleDialog.show(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.ruleDiv {
  padding: 24px;
  .el-button {
    float: right;
    margin-bottom: 12px;
  }
}
</style>
