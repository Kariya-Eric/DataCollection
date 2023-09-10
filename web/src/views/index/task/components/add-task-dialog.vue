<template>
  <dc-dialog fullscreen :visible.sync="visible" :title="title" :show-close="false" :submitButtons="false" @close="$emit('refresh')">
    <div class="steps">
      <el-steps :active="currentStep" align-center finish-status="success" process-status="finish">
        <el-step title="基础信息" />
        <el-step title="表单配置" />
        <el-step title="权限配置" />
        <el-step title="任务配置完成" />
      </el-steps>
    </div>
    <div>
      <add-task-step-first :years="years" v-if="currentStep === 0" @initTask="initTask" @back="close" @change="changeStep" :task="taskInfo" />
      <add-task-step-second v-if="currentStep === 1" @change="changeStep" :task="taskInfo" @back="close" />
      <add-task-step-third v-if="currentStep === 2" @change="changeStep" :task="taskInfo" @back="close" />
      <add-task-step-fourth v-if="currentStep === 3" @back="showTaskInfo" :taskId="taskInfo.id" />
    </div>
  </dc-dialog>
</template>

<script>
import { getTaskInfo } from '@/api/task'
import AddTaskStepFirst from './step1/add-task-step-first'
import AddTaskStepSecond from './step2/add-task-step-second'
import AddTaskStepThird from './step3/add-task-step-third'
import AddTaskStepFourth from './step4/add-task-step-fourth'
export default {
  name: 'AddTaskDialog',
  components: {
    AddTaskStepFirst,
    AddTaskStepSecond,
    AddTaskStepThird,
    AddTaskStepFourth
  },
  props: ['years', 'name'],
  data() {
    return {
      visible: false,
      currentStep: 0,
      title: '',
      taskInfo: {}
    }
  },
  methods: {
    add() {
      this.edit({})
    },

    edit(record) {
      this.taskInfo = Object.assign({}, record)
      this.currentStep = 0
      this.visible = true
    },

    close() {
      this.taskId = ''
      this.visible = false
    },

    changeStep(step) {
      getTaskInfo(this.taskInfo.id)
        .then(res => {
          if (res.state) {
            this.taskInfo = res.value
          }
        })
        .finally(() => {
          this.currentStep = step
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
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.steps {
  width: 70%;
  margin: auto;
  margin-bottom: 36px;
  margin-top: 36px;
}
</style>
