<template>
  <div>
    <el-drawer
      :append-to-body="true"
      :visible="visible"
      :show-close="false"
      :size="1000"
    >
      <div slot="title" class="titleSlot">
        <span>协作进度</span>
        <div class="titleButton">
          <Mbutton type="primary" icon="催办" name="一键催办" />
          <Mbutton type="primary" icon="查看表单" name="查看表单" />
          <Mbutton name="返回" icon="返回" @click="onClose" />
        </div>
      </div>
      <el-descriptions :column="2">
        <el-descriptions-item label="表单名称">{{
          formInfo.formName
        }}</el-descriptions-item>
        <el-descriptions-item label="填报时间">
          {{ formInfo.statisticsEndTime }}至{{
            formInfo.statisticsEndTime
          }}</el-descriptions-item
        >
        <el-descriptions-item label="审核人"></el-descriptions-item>
        <el-descriptions-item label="整体提交进度"
          ><el-progress
            :percentage="50"
            style="display: inline-flex; width: 50%; margin-top: 8px"
          />
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <div class="tooltip">
        <svg-icon icon-class="部门备份3" />
        <span style="margin-left: 8px">负责部门</span>
        <svg-icon icon-class="部门" style="margin-left: 50px" />
        <span style="margin-left: 8px">协作部门</span>
      </div>
      <el-table
        v-loading="loading"
        :data="dataSource"
        class="listTable"
        :header-cell-style="headerStyle"
        row-key="id"
      >
        <el-table-column
          label="部门"
          prop="collaborateOrgName"
          align="center"
        />
        <el-table-column label="填报人" prop="fillUserName" align="center" />
        <el-table-column
          label="最新提交时间"
          prop="statisticsEndTime"
          align="center"
        />
        <el-table-column label="审核状态" prop="status" align="center">
          <template slot-scope="scope">
            <status
              :status="caculateStatus(scope.row.status).status"
              :title="caculateStatus(scope.row.status).name"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <menu-link>查看</menu-link>
            <menu-link no-divider>催办</menu-link>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { collaborationProgress } from "@/api/task";
export default {
  name: "ProgressDrawer",
  data() {
    return {
      visible: false,
      loading: false,
      formInfo: {},
      dataSource: [],
      headerStyle: {
        backgroundColor: "#F4F5F6",
      },
    };
  },
  methods: {
    onClose() {
      this.visible = false;
    },
    show(info) {
      this.loading = true;
      this.formInfo = info;
      collaborationProgress(info.taskFormId)
        .then((res) => {
          if (res.state) {
            this.dataSource = res.value.children;
          }
        })
        .finally(() => (this.loading = false));
      this.visible = true;
    },

    caculateStatus(status) {
      if (status == 0) {
        return { status: 2, name: "待提交" };
      } else if (status == 1) {
        return { status: 1, name: "审核中" };
      } else if (status == 2) {
        return { status: 3, name: "审核通过" };
      } else if (status == 3) {
        return { status: 0, name: "退回修改" };
      } else {
        return { status: 2, name: "待配置人员" };
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tooltip {
  margin-bottom: 12px;
}
/deep/ .el-divider--horizontal {
  background: 0 0;
  border-top: 1px dashed #e8eaec;
}
</style>
