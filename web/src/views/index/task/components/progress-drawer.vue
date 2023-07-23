<template>
  <div>
    <el-drawer
      :append-to-body="true"
      :visible="visible"
      @close="onClose"
      size="50%"
      title="协作进度"
    >
      <div class="innerDrawer">
        <el-descriptions>
          <el-descriptions-item label="表单名称" :span="3">{{
            formInfo.formName
          }}</el-descriptions-item>
          <el-descriptions-item label="统计时间" :span="3">{{
            formInfo.statisticsEndTime
          }}</el-descriptions-item>
          <el-descriptions-item label="审核人" :span="3"></el-descriptions-item>
          <el-descriptions-item label="整体提交进度" 
            ><el-progress :percentage="50" style="display: inline-flex;width: 20%;" />
          </el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <el-table
          v-loading="loading"
          :data="dataSource"
          size="small"
          row-key="id"
          :border="true"
        >
          <el-table-column
            label="部门"
            prop="collaborateOrgName"
            align="center"
          />
          <el-table-column label="填报人" prop="fillUserName" align="center" />
          <el-table-column label="最新提交时间" prop="type" align="center" />
          <el-table-column label="最新提交时间" prop="type" align="center" />
          <el-table-column label="审核状态" prop="status" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="info" size="small"
                >待提交</el-tag
              >
              <el-tag v-if="scope.row.status === 1" size="small">审核中</el-tag>
              <el-tag v-if="scope.row.status === 2" type="success" size="small"
                >审核通过</el-tag
              >
              <el-tag v-if="scope.row.status === 3" type="danger" size="small"
                >退回修改</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center"></el-table-column>
        </el-table>
      </div>
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
  },
};
</script>

<style scoped lang="scss">
.innerDrawer {
  margin: 24px;
}
</style>
