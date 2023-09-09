<template>
  <div class="main-form" style="overflow: hidden">
    <div class="header">
      <el-row>
        <span>表单集合&nbsp;&nbsp;&nbsp;</span>
        <el-select v-model="selectFormCollection" clearable :disabled="task.type == '教学基本状态数据'">
          <el-option v-for="item in formCollectionList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" style="float: right" @click="applyDeadlineBatch">批量配置统计截止时间</el-button>
      </el-row>
    </div>

    <dc-table :data="formList" ref="formTable" v-loading="loading" @selection-change="onSelectChange" :columns="columns" selection="selection">
      <template slot="isCanFill" slot-scope="scope">
        <el-tag v-if="scope.row.isCanFill" type="success">可填报</el-tag>
        <el-tag v-else type="warning">不可填报</el-tag>
      </template>
      <template slot="remark" slot-scope="scope">
        <dc-ellipsis v-if="scope.row.remark" :value="scope.row.remark" />
        <span v-else>-</span>
      </template>
      <template slot="action" slot-scope="scope">
        <a @click="applyDeadline(scope.row)">配置统计截止时间</a>
        <el-divider direction="vertical" v-if="!scope.row.formRequired" />
        <a @click="applyCanfill(scope.row)" v-if="judgeCanfill(scope.row)">申请不可填报</a>
        <el-popconfirm v-if="judgeRedo(scope.row)" @confirm="redoCanfill(scope.row)" title="确定撤销不可填报吗？" icon="el-icon-info" icon-color="red">
          <a slot="reference" no-divider>撤销不可填报</a>
        </el-popconfirm>
      </template>
    </dc-table>

    <div class="footer">
      <el-button type="primary" @click="frontStep" style="margin-right: 16px" :loading="loading">上一步</el-button>
      <el-popover placement="bottom" v-model="confirmVisible" trigger="manual">
        <p>所有表单的截止时间相同，是否确认？</p>
        <div style="text-align: right; margin: 0">
          <el-button type="primary" @click="nextStep">确定</el-button>
          <el-button @click="confirmVisible = !confirmVisible">返回</el-button>
        </div>
        <el-button type="primary" @click="showConfirm" slot="reference" :loading="loading">下一步</el-button>
      </el-popover>
      <el-button @click="back" style="margin-left: 16px">返回</el-button>
    </div>
    <unfill-dialog ref="unfillDialog" @refresh="refreshUnfill" :taskId="taskInfo.id" />
    <count-deadline-dialog
      ref="countDeadlineDialog"
      :taskId="taskInfo.id"
      :endTime="taskInfo.statisticsEndTime"
      @refresh="refreshDeadLine"
      @close="$refs.formTable.clearSelection()"
    />
  </div>
</template>

<script>
import CountDeadlineDialog from './count-deadline-dialog'
import UnfillDialog from './unfill-dialog'
import { formCollectionList } from '@/api/form'
import { updateTask, getTaskFormList, configFillStatus } from '@/api/task'
export default {
  components: { UnfillDialog, CountDeadlineDialog },
  props: ['task'],
  name: 'AddTaskStepSecond',
  data() {
    return {
      selectedRowKeys: [],
      selectFormCollection: '',
      formCollectionList: [],
      formList: [],
      loading: false,
      taskInfo: this.task,
      confirmVisible: false,
      columns: [
        { prop: 'formName', label: '表单名称' },
        { slot: 'isCanFill', label: '是否可填报' },
        { slot: 'remark', label: '备注' },
        { prop: 'statisticsEndTime', label: '统计截止日期' },
        { slot: 'action', label: '操作', width: '280px' }
      ]
    }
  },

  mounted() {
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
            this.formCollectionList = res.value.rows
            let formCollection = res.value.rows.find(r => r.year == parseInt(this.task.year) + 1 && r.type == '教学基本状态数据')
            if (formCollection) this.selectFormCollection = formCollection.id
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
      this.$refs.unfillDialog.edit(row)
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
        this.$refs.countDeadlineDialog.edit([...this.selectedRowKeys])
      }
    },

    applyDeadline(row) {
      this.$refs.countDeadlineDialog.edit([row])
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
      this.$refs.formTable.clearSelection()
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
      formCollectionList({}).then(res => {
        if (res.state) {
          this.formCollectionList = res.value.rows
        }
      })
    },

    back() {
      this.$emit('back')
    },

    redoCanfill(row) {
      const { taskId, formId, isCanFill } = row
      configFillStatus({
        taskId,
        formId,
        isCanFill: !isCanFill,
        remark: ''
      }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          row.isCanFill = !row.isCanFill
          row.remark = ''
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
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

.footer {
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
</style>
