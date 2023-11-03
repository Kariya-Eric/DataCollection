<template>
  <a-card>
    <a-spin :spinning="infoLoading">
      <a-descriptions :column="4">
        <template slot="title">
          <a-row :gutter="24">
            <a-col :span="12">
              <div class="img-div">
                <img src="@/assets/icons/base_info.svg" />
                <span style="margin-left: 12px">基础信息</span>
              </div>
            </a-col>
            <a-col :span="12">
              <div style="float: right">
                <a-button type="primary" v-action="'taskInfo_edit'" v-if="!taskInfo.enabledFlag" @click="editTask"><dc-icon type="icon-dc_edit" />编辑</a-button>
                <a-button @click="$router.back(-1)" style="margin-left: 12px"><dc-icon type="icon-dc_back" />返回</a-button>
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
        <a-descriptions-item label="学校专业类别">
          <a-tag v-for="(item, index) in tagList" :key="index">
            <span style="color: #ef722e">{{ item }}</span>
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="合集名称"> ？？ </a-descriptions-item>
        <a-descriptions-item label="合集年份"> ？？ </a-descriptions-item>
        <a-descriptions-item label="任务状态">
          <dc-status :name="caculateStatus(taskInfo).name" :color="caculateStatus(taskInfo).color" />
        </a-descriptions-item>
        <a-descriptions-item label="任务进度">
          <a-progress :percent="taskInfo.percentage" />
        </a-descriptions-item>
      </a-descriptions>
    </a-spin>
    <a-divider />
    <a-descriptions style="margin-top: 24px">
      <template slot="title">
        <div class="img-div">
          <img src="@/assets/icons/form_assign.svg" />
          <span style="margin-left: 12px">表单分配</span>
        </div>
      </template>
    </a-descriptions>
    <a-table bordered rowKey="formId" :dataSource="dataSource" :pagination="false" :loading="tableLoading" :columns="columns"></a-table>
    <task-modal ref="modalForm" @ok="getTaskInfo" />
  </a-card>
</template>

<script>
import TaskModal from './components/task-modal.vue'
import { getTaskFormList, getTaskInfo } from '@/api/task'
export default {
  name: 'TaskInfo',
  components: { TaskModal },
  data() {
    return {
      taskId: '',
      dataSource: [],
      tagList: [],
      infoLoading: false,
      tableLoading: false,
      columns: [
        {
          dataIndex: 'formCategoriesName',
          title: '表单大类',
          align: 'center',
          customRender: (text, row, index) => {
            const obj = {
              children: text !== null ? text : '',
              attrs: {
                rowSpan: 1
              }
            }
            obj.attrs.rowSpan = this.renderCells(text, this.dataSource, 'formCategoriesName', index)
            return obj
          }
        },
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
    renderCells(text, data, key, index) {
      if (data.length < 1) {
        return 1
      }
      if (text === '' || text === null) {
        data[index].rowNum = 1
        return 1
      }
      // 上一行该列数据是否一样
      if (index !== 0 && text === data[index - 1][key]) {
        data[index].rowNum = 0
        return 0
      }
      let rowSpan = 1
      // 判断下一行是否相等
      for (let i = index + 1; i < data.length; i++) {
        if (text !== data[i][key]) {
          break
        }
        rowSpan++
      }
      data[index].rowNum = rowSpan
      return rowSpan
    },

    editTask() {
      this.$refs.modalForm.edit(this.taskInfo, '编辑任务')
    },

    getTaskInfo() {
      this.infoLoading = true
      getTaskInfo(this.taskId)
        .then(res => {
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
    },

    caculateStatus(record) {
      if (record.status == 3 || record.status == '3') {
        return { name: '停用', color: 'red' }
      } else if (record.status == 1 || record.status == '1') {
        return { name: '启用中', color: 'blue' }
      } else if (record.status == 0 || record.status == '0') {
        return { name: '未启用', color: 'grey' }
      } else if (record.status == 2 || record.status == '2') {
        return { name: '完成', color: 'green' }
      }
      return { name: '启用中', color: 'blue' }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-descriptions-item-content {
  width: 50%;
}
</style>
