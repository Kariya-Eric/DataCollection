<template>
  <div class="main-form" style="overflow: hidden">
    <div class="header">
      <el-row>
        <span>表单集合&nbsp;&nbsp;&nbsp;</span
        ><el-select v-model="selectForm" size="small"></el-select>
        <el-button
          type="primary"
          size="small"
          style="float: right"
          @click="applyDeadline(true)"
          >批量配置统计截止时间</el-button
        >
      </el-row>
    </div>
    <el-table :data="formList" size="small" :border="true" v-loading="loading">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="表单列表" align="center" />
      <el-table-column label="状态" align="center" />
      <el-table-column label="备注" align="center" />
      <el-table-column label="统计截止日期" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <a href="javascript:;" @click="applyDeadline(false, scope.row)"
            >配置统计截止时间</a
          >
          <el-divider direction="vertical" />
          <a href="javascript:;" v-if="scope.row.status == 1" @click="apply"
            >申请不可填报</a
          >
          <el-popconfirm
            v-else
            title="确定撤销不可填报吗？"
            icon="el-icon-info"
            icon-color="red"
          >
            <a href="javascript:;">撤销不可填报</a>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <unfill-dialog ref="unfillDialog" />
    <count-deadline-dialog ref="countDeadlineDialog" />
  </div>
</template>

<script>
import CountDeadlineDialog from "./count-deadline-dialog";
import UnfillDialog from "./unfill-dialog";
export default {
  components: { UnfillDialog, CountDeadlineDialog },
  name: "AddTaskStepSecond",
  data() {
    return {
      selectForm: "",
      formList: [],
      loading: false,
    };
  },
  methods: {
    apply() {
      this.$refs.unfillDialog.show();
    },

    applyDeadline(isBatch, row) {
      if (isBatch) {
        this.$refs.countDeadlineDialog.show(isBatch);
      } else {
        this.$refs.countDeadlineDialog.show(isBatch, row.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 24px;
  .headerButton {
    margin-right: 0px;
  }
}
.main-form {
  width: 60%;
  margin: auto;
}
</style>