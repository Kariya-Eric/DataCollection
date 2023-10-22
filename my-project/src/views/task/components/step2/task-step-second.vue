<template>
  <div class="main-form">
    <div class="header">
      <a-row>
        <span style="margin-right: 12px">表单集合</span>
        <a-select v-model="selectFormCollection" allowClear :disabled="task.type == '教学基本状态数据'" style="width: 15%" placeholder="请选择表单合集">
          <a-select-option v-for="item in formCollectionList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
        <a style="margin-left: 12px; color: red">{{ tips }}</a>
        <a-button type="primary" style="float: right" @click="applyDeadlineBatch"> <dc-icon type="icon-dc_batch_config" />批量配置统计截止时间</a-button>
      </a-row>
    </div>

    <a-table
      bordered
      rowKey="formId"
      :dataSource="formList"
      :pagination="false"
      :loading="loading"
      :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :columns="columns"
    >
      <template slot="isCanFill" slot-scope="text, record">
        <dc-status v-if="record.isCanFill" color="green" name="可填报" />
        <dc-status v-else color="red" name="不可填报" />
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="applyDeadline(record)">配置统计截止时间</a>
        <a-divider v-if="!record.formRequired" />
        <a @click="applyCanfill(record)" v-if="judgeCanfill(record)">申请不可填报</a>
        <a-popconfirm v-if="judgeRedo(record)" @confirm="redoCanfill(record)" title="确定撤销不可填报吗？" type="question-circle-o" style="color: red">
          <a>撤销不可填报</a>
        </a-popconfirm>
      </template>
    </a-table>

    <div class="footer">
      <a-button type="primary" @click="frontStep" :loading="loading">上一步</a-button>
      <a-popconfirm
        title="所有表单的截止时间相同，是否确认？"
        :visible="confirmVisible"
        placement="bottom"
        @confirm="nextStep"
        @cancel="confirmVisible = !confirmVisible"
        cancelText="返回"
      >
        <a-button type="primary" @click="showConfirm" :loading="loading">下一步</a-button>
      </a-popconfirm>
      <a-button @click="back">返回</a-button>
    </div>
    <unfill-modal ref="unfillModal" @refresh="refreshUnfill" :taskId="taskInfo.id" />
    <count-deadline-modal
      ref="countDeadlineModal"
      :taskId="taskInfo.id"
      :options="formList"
      :endTime="taskInfo.statisticsEndTime"
      @refresh="refreshDeadLine"
      @close="selectedRowKeys = []"
    />
  </div>
</template>

<script>
import CountDeadlineModal from './count-deadline-modal'
import UnfillModal from './unfill-modal'
import { formCollectionList } from '@/api/form'
import { updateTask, getTaskFormList, configFillStatus } from '@/api/task'
export default {
  components: { CountDeadlineModal, UnfillModal },
  props: ['task'],
  name: 'TaskStepSecond',
  data() {
    return {
      tips: '',
      selectedRowKeys: [],
      selectFormCollection: '',
      formCollectionList: [],
      formList: [],
      loading: false,
      taskInfo: this.task,
      confirmVisible: false,
      columns: [
        { dataIndex: 'formName', title: '表单名称', align: 'center', ellipsis: true },
        { title: '是否可填报', align: 'center', scopedSlots: { customRender: 'isCanFill' } },
        { dataIndex: 'remark', title: '备注', ellipsis: true, align: 'center' },
        { dataIndex: 'statisticsEndTime', title: '统计截止日期', align: 'center' },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },

  mounted() {
    this.tips = ''
    this.initData()
  },

  watch: {
    selectFormCollection(newVal) {
      if (newVal == '' || !newVal) {
        this.formList = []
      } else {
        this.loading = true
        let query = {
          taskId: this.taskInfo.id,
          formCollectionId: newVal
        }
        getTaskFormList(query)
          .then(res => {
            if (res.state) {
              this.formList = res.value.map(val => {
                if (!val.statisticsEndTime) {
                  val.statisticsEndTime = this.taskInfo.statisticsEndTime
                }
                return val
              })
            }
          })
          .finally(() => (this.loading = false))
      }
    }
  },

  methods: {
    initData() {
      if (this.task.type == '教学基本状态数据') {
        formCollectionList({ year: this.task.year }).then(res => {
          if (res.state) {
            this.formCollectionList = res.value.rows.filter(item => item.enabledFlag == 1)
            if (this.formCollectionList.length == 0) {
              this.tips = '当前年份下不存在表单合集或表单合集未启用'
            }
            let formCollection = this.formCollectionList.find(r => r.year == parseInt(this.task.year) + 1 && r.type == '教学基本状态数据')
            if (formCollection) {
              this.selectFormCollection = formCollection.id
            } else {
              this.tips = '当前年份下不存在表单合集或表单合集未启用'
            }
          }
        })
      } else {
        formCollectionList({}).then(res => {
          if (res.state) {
            this.formCollectionList = res.value.rows.filter(item => item.enabledFlag == 1)
            this.selectFormCollection = this.taskInfo.formCollectionId
          }
        })
      }
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys
    },

    applyCanfill(row) {
      this.$refs.unfillModal.edit(row)
    },

    judgeCanfill(row) {
      return row.isCanFill && !row.formRequired
    },

    judgeRedo(row) {
      return !row.isCanFill && !row.formRequired
    },

    refreshUnfill(unfillForm) {
      let form = this.formList.find(form => form.formId == unfillForm.formId)
      form.isCanFill = false
      form.remark = unfillForm.remark
    },

    applyDeadlineBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请至少选择一行')
        return
      } else {
        this.$refs.countDeadlineModal.edit(this.selectedRowKeys)
      }
    },

    applyDeadline(row) {
      this.$refs.countDeadlineModal.edit(row)
    },

    showConfirm() {
      if (this.selectFormCollection == '' || !this.selectFormCollection) {
        this.$message.error('请选择表单合集！')
        return
      }
      if (this.formList.length > 1) {
        let endTime = this.formList[0].statisticsEndTime
        if (this.formList.every(e => e.statisticsEndTime == endTime)) {
          this.confirmVisible = true
          return
        }
      }
      this.nextStep()
    },

    refreshDeadLine(deadlineForm) {
      this.selectedRowKeys = []
      this.formList.forEach(form => {
        deadlineForm.formIds.forEach(formId => {
          if (form.formId == formId) {
            form.statisticsEndTime = deadlineForm.statisticsEndTime
          }
        })
      })
    },

    frontStep() {
      this.$emit('change', 0)
    },

    nextStep() {
      let params = {
        ...this.taskInfo,
        formCollectionId: this.selectFormCollection
      }
      this.loading = true
      updateTask(params)
        .then(res => {
          if (res.state) {
            this.$emit('change', 2)
          }
        })
        .finally(() => (this.loading = false))
    },

    getFormCollectionList() {
      this.loading = true
      formCollectionList({})
        .then(res => {
          if (res.state) {
            this.formCollectionList = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    back() {
      this.$emit('back')
    },

    redoCanfill(row) {
      const { taskId, formId, isCanFill } = row
      this.loading = true
      configFillStatus({
        taskId,
        formId,
        isCanFill: !isCanFill,
        remark: ''
      })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            row.isCanFill = !row.isCanFill
            row.remark = ''
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style lang="less" scoped>
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

.footer {
  margin-top: 36px;
  text-align: center;
  .ant-btn {
    margin-left: 24px;
  }
}
</style>
