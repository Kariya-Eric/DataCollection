<template>
  <dc-modal :visible="visible" :confirmLoading="loading">
    <template slot="title"> {{ title }}</template>
    <div class="steps">
      <a-steps :current="currentStep">
        <a-step title="基础信息"> </a-step>
        <a-step title="表单配置"> </a-step>
        <a-step title="权限配置"> </a-step>
        <a-step title="任务配置完成"> </a-step>
      </a-steps>
    </div>
    <div>
      <task-step-first :years="years" v-if="currentStep === 0" @initTask="initTask" @back="close" @change="changeStep" :task="taskInfo" />
      <task-step-second v-if="currentStep === 1" @change="changeStep" :task="taskInfo" @back="close" />
      <task-step-third v-if="currentStep === 2" @change="changeStep" :task="taskInfo" @back="close" />
      <task-step-fourth v-if="currentStep === 3" @back="showTaskInfo" :taskId="taskInfo.id" />
    </div>
  </dc-modal>
</template>

<script>
import { getTaskInfo } from '@/api/task'
import TaskStepFirst from './step1/task-step-first'
import TaskStepSecond from './step2/task-step-second'
import TaskStepThird from './step3/task-step-third'
import TaskStepFourth from './step4/task-step-fourth'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import moment from 'moment'
export default {
  name: 'TaskModal',
  props: ['years'],
  components: { TaskStepFirst, TaskStepSecond, TaskStepThird, TaskStepFourth },
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      taskInfo: {},
      currentStep: 0
    }
  },
  methods: {
    add(title) {
      this.edit({}, title)
    },

    edit(record, title) {
      this.title = title
      this.taskInfo = { ...Object.assign({}, record), statisticsStartTime: moment().format('YYYY-MM-DD'), statisticsEndTime: moment().format('YYYY-MM-DD') }
      this.currentStep = 0
      this.visible = true
    },

    close() {
      this.taskId = ''
      this.$emit('ok')
      this.visible = false
      this.taskInfo = {}
    },

    changeStep(step) {
      this.loading = true
      getTaskInfo(this.taskInfo.id)
        .then(res => {
          if (res.state) {
            this.taskInfo = res.value
          }
        })
        .finally(() => {
          this.currentStep = step
          this.loading = false
        })
    },

    initTask(taskId) {
      this.taskInfo.id = taskId
    },

    showTaskInfo() {
      this.$router.push({
        path: '/task/info',
        query: { taskId: this.taskInfo.id }
      })
      this.close()
    }
  }
}
</script>

<style lang="less" scoped>
.steps {
  width: 60%;
  margin: auto;
  margin-bottom: 64px;
  margin-top: 64px;
}
/deep/.ant-modal {
  width: 100vw !important;
  max-width: 100vw !important;
  top: 0 !important;
  padding: 0 !important;
}
/deep/.ant-modal-body {
  height: calc(100vh - 64px) !important;
  max-height: calc(100vh - 64px) !important;
  padding-top: 8px !important;
  overflow: auto;
}
/deep/.ant-modal-header {
  border-radius: 0 !important;
}
/deep/.ant-modal-title {
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: 26px !important;
}
/deep/.ant-modal-content {
  height: 100vh !important;
  border-radius: 0 !important;
}
</style>
