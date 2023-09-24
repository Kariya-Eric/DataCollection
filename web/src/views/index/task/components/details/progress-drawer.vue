<template>
  <div>
    <el-drawer :append-to-body="true" :visible="visible" :show-close="false" :size="1200">
      <div slot="title" class="card-title">
        <span>协作进度</span>
        <div class="card-title-button">
          <el-button type="primary"><svg-icon icon-class="催办" />一键催办</el-button>
          <el-button type="primary"><svg-icon icon-class="查看表单" />查看表单</el-button>
          <el-button @click="onClose"><svg-icon icon-class="返回" />返回</el-button>
        </div>
      </div>
      <el-descriptions :column="2" size="medium">
        <el-descriptions-item label="表单名称">{{ formInfo.formName }}</el-descriptions-item>
        <el-descriptions-item label="填报时间"> {{ formInfo.statisticsEndTime }}至{{ formInfo.statisticsEndTime }}</el-descriptions-item>
        <el-descriptions-item label="审核人"></el-descriptions-item>
        <el-descriptions-item label="整体提交进度"
          ><el-progress :percentage="50" style="display: inline-flex; width: 50%; margin-top: 8px" />
        </el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <div class="tooltip">
        <svg-icon icon-class="部门备份3" />
        <span style="margin-left: 8px">负责部门</span>
        <svg-icon icon-class="部门" style="margin-left: 50px" />
        <span style="margin-left: 8px">协作部门</span>
      </div>

      <dc-table v-loading="loading" :data="dataSource" :columns="columns" row-key="id">
        <template slot="status" slot-scope="scope">
          <dc-status :status="caculateStatus(scope.row.status).status" :title="caculateStatus(scope.row.status).name" />
        </template>
        <template slot="action" slot-scope="scope">
          <a>查看</a>
          <a>催办</a>
        </template>
      </dc-table>
    </el-drawer>
  </div>
</template>

<script>
import { collaborationProgress } from '@/api/task'
export default {
  name: 'ProgressDrawer',
  data() {
    return {
      visible: false,
      loading: false,
      formInfo: {},
      dataSource: [],
      columns: [
        { label: '部门', prop: 'orgName' },
        { label: '填报人', prop: 'fillUserName' },
        { label: '最新提交时间', prop: 'statisticsEndTime' },
        { label: '审核状态', action: 'status' }
      ]
    }
  },
  methods: {
    onClose() {
      this.visible = false
    },
    show(info) {
      this.loading = true
      this.formInfo = info
      collaborationProgress(info.taskFormId)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value.children
          }
        })
        .finally(() => (this.loading = false))
      this.visible = true
    },

    caculateStatus(status) {
      if (status == 0) {
        return { status: 2, name: '待提交' }
      } else if (status == 1) {
        return { status: 1, name: '审核中' }
      } else if (status == 2) {
        return { status: 3, name: '审核通过' }
      } else if (status == 3) {
        return { status: 0, name: '退回修改' }
      } else {
        return { status: 2, name: '待配置人员' }
      }
    }
  }
}
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
