<template>
  <a-card>
    <a-spin :spinning="infoLoading">
      <a-descriptions :column="4">
        <template slot="title">
          <a-row :gutter="24">
            <a-col :span="12">基础信息</a-col>
            <a-col :span="12">
              <div style="float: right">
                <a-button type="primary" style="margin-right: 12px" v-action="'taskInfo_edit'" v-if="!taskInfo.enabledFlag">编辑</a-button>
                <a-button @click="$router.back(-1)">返回</a-button>
              </div>
            </a-col>
          </a-row>
        </template>
        <a-descriptions-item label="任务名称">{{ taskInfo.name }} </a-descriptions-item>
        <a-descriptions-item label="任务类型">{{ taskInfo.type }}</a-descriptions-item>
        <a-descriptions-item label="填报开始时间">{{ taskInfo.statisticsStartTime }} </a-descriptions-item>
        <a-descriptions-item label="填报截止时间">{{ taskInfo.statisticsEndTime }}</a-descriptions-item>
        <a-descriptions-item label="统计时间"> ？？ </a-descriptions-item>
        <a-descriptions-item label="学年"> {{ taskInfo.schoolYear }}</a-descriptions-item>
        <a-descriptions-item label="自然年">{{ taskInfo.year }}</a-descriptions-item>
        <a-descriptions-item label="学校专业类别"> </a-descriptions-item>
        <a-descriptions-item label="合集名称"> ？？ </a-descriptions-item>
        <a-descriptions-item label="合集年份"> ？？ </a-descriptions-item>
        <a-descriptions-item label="任务状态"> </a-descriptions-item>
        <a-descriptions-item label="任务进度">
          <a-progress :percent="taskInfo.percentage" />
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <a-divider />
    <a-descriptions style="margin-top: 24px">
      <template slot="title"> 表单分配 </template>
    </a-descriptions>
    <a-table bordered rowKey="formId" :dataSource="dataSource" :pagination="false" :loading="tableLoading" :columns="columns"></a-table>
  </a-card>
</template>

<script>
import { getTaskFormList, getTaskInfo } from '@/api/task'
export default {
  name: 'TaskInfo',
  data() {
    return {
      taskId: '',
      dataSource: [],
      infoLoading: false,
      tableLoading: false,
      columns: [
        { dataIndex: 'formCategoriesName', title: '表单大类', align: 'center' },
        { dataIndex: 'formName', title: '表单名称', align: 'center' },
        { dataIndex: 'responsibleOrgName', title: '负责部门', align: 'center' },
        { dataIndex: 'collaborateOrgName', title: '协作部门', align: 'center' },
        { dataIndex: 'statisticsEndTime', title: '统计截止日期', align: 'center' }
      ],
      taskInfo: {}
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'taskInfo') {
          this.taskId = newRoute.query.taskId
          this.getTaskInfo()
        }
      },
      immediate: true
    }
  },

  methods: {
    getTaskInfo() {
      this.infoLoading = true
      getTaskInfo(this.taskId)
        .then(res => {
          if (res.state) {
            this.taskInfo = res.value
            if (this.taskInfo.formCollectionId) {
              this.getFormList()
            }
          }
        })
        .finally(() => (this.infoLoading = false))
    },

    getFormList() {
      this.tableLoading = true
      let query = {
        taskId: this.taskInfo.id,
        formCollectionId: this.taskInfo.formCollectionId
      }
      getTaskFormList(query)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value.sort((v1, v2) => (v1.formCategories < v2.formCategories ? -1 : v1.formCategories == v2.formCategories ? 0 : 1))
          }
        })
        .finally(() => (this.tableLoading = false))
    }
  }
}
</script>

<style></style>
