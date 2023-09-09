<template>
  <el-card shadow="always" class="app-card">
    <div class="main-content">
      <el-descriptions :column="4" size="medium">
        <template slot="title">
          <svg-icon icon-class="基础信息" />
          <span style="margin-left: 8px">基础信息</span>
        </template>
        <template slot="extra">
          <el-button type="primary" v-if="!taskInfo.enabledFlag" v-has="'taskInfo_edit'" @click="editTask"><svg-icon icon-class="编辑" />编辑</el-button>
          <el-button @click="goBack"><svg-icon icon-class="返回" />返回</el-button>
        </template>
        <el-descriptions-item label="任务名称">{{ taskInfo.name }} </el-descriptions-item>
        <el-descriptions-item label="任务类型">{{ taskInfo.type }}</el-descriptions-item>
        <el-descriptions-item label="填报开始时间">{{ taskInfo.statisticsStartTime }} </el-descriptions-item>
        <el-descriptions-item label="填报截止时间">{{ taskInfo.statisticsEndTime }}</el-descriptions-item>
        <el-descriptions-item label="统计时间"> ？？ </el-descriptions-item>
        <el-descriptions-item label="学年"> {{ taskInfo.schoolYear }}</el-descriptions-item>
        <el-descriptions-item label="自然年">{{ taskInfo.year }}</el-descriptions-item>
        <el-descriptions-item label="学校专业类别">
          <div class="tagDiv">
            <el-tag v-for="(item, index) in tagList" size="medium" :key="index">{{ item }}</el-tag>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="合集名称"> ？？ </el-descriptions-item>
        <el-descriptions-item label="合集年份"> ？？ </el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <dc-status :status="taskInfo.status" />
        </el-descriptions-item>
        <el-descriptions-item label="任务进度">
          <el-progress :percentage="taskInfo.percentage" style="display: inline-flex; width: 60%; margin-top: 14px; margin-left: 12px" />
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions style="margin-top: 24px">
        <template slot="title">
          <svg-icon icon-class="表单分配" />
          <span style="margin-left: 8px">表单分配</span>
        </template>
      </el-descriptions>

      <dc-table :data="formList" v-loading="loading" :span-method="objectSpanMethod" :columns="columns" />
    </div>
    <add-task-dialog ref="addTaskDialog" @refresh="getTaskInfo" name="任务" />
  </el-card>
</template>

<script>
import addTaskDialog from './components/add-task-dialog'
import { getTaskFormList, getTaskInfo } from '@/api/task'
export default {
  components: { addTaskDialog },
  name: 'TaskInfo',
  data() {
    return {
      taskId: undefined,
      taskInfo: { status: 0 },
      formList: [],
      loading: false,
      tagList: [],
      indexArray: [],
      columns: [
        { label: '表单大类', prop: 'formCategoriesName' },
        { label: '表单名称', prop: 'formName' },
        { label: '负责部门', prop: 'responsibleOrgName' },
        { label: '协作部门', prop: 'collaborateOrgName' },
        { label: '统计截止日期', prop: 'statisticsEndTime' }
      ]
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
    goBack() {
      this.$router.back(-1)
    },

    getTaskInfo() {
      getTaskInfo(this.taskId).then(res => {
        if (res.state) {
          this.taskInfo = res.value
          if (this.taskInfo.professionalCategory) {
            this.tagList = this.taskInfo.professionalCategory.split(',')
          }
          if (this.taskInfo.formCollectionId) {
            this.getFormList()
          }
        }
      })
    },

    editTask() {
      this.$refs.addTaskDialog.title = '编辑' + this.$refs.addTaskDialog.name
      this.$refs.addTaskDialog.edit(this.taskInfo)
    },

    getFormList() {
      this.loading = true
      let query = {
        taskId: this.taskInfo.id,
        formCollectionId: this.taskInfo.formCollectionId
      }
      getTaskFormList(query)
        .then(res => {
          if (res.state) {
            this.formList = res.value.sort((v1, v2) => (v1.formCategories < v2.formCategories ? -1 : v1.formCategories == v2.formCategories ? 0 : 1))
            this.getIndexArray()
          }
        })
        .finally(() => (this.loading = false))
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let rowCount = 0
        if (this.indexArray.includes(rowIndex)) {
          rowCount = this.getRows(rowIndex, row.formCategories)
          return { rowspan: rowCount, colspan: 1 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    },

    getRows(rowIndex, formCategories) {
      let count = 0
      for (let i = rowIndex; i < this.formList.length; i++) {
        if (this.formList[i].formCategories === formCategories) {
          count++
        } else {
          break
        }
      }
      return count
    },

    getIndexArray() {
      let count = 0
      for (let rowIndex = 0; rowIndex < this.formList.length; ) {
        this.indexArray.push(rowIndex)
        count = this.getRows(rowIndex, this.formList[rowIndex].formCategories)
        rowIndex += count
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  margin: 4px 0px 20px 0px;
  .el-tag {
    margin-left: 10px;
    border-radius: 13px;
    color: #ef722e;
    background-color: #fff1ea;
    border-color: #ef722e;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
  }
}
</style>
