<template>
  <div>
    <div class="title">{{ title }}</div>
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
  </div>
</template>

<script>
import { getTaskInfo } from '@/api/task'
import TaskStepFirst from './step1/task-step-first'
import TaskStepSecond from './step2/task-step-second'
import TaskStepThird from './step3/task-step-third'
import TaskStepFourth from './step4/task-step-fourth'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { TEMP_TASK } from '@/store/mutation-types'
import storage from 'store'
import moment from 'moment'
export default {
  name: 'TaskView',
  components: { TaskStepFirst, TaskStepSecond, TaskStepThird, TaskStepFourth },
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      taskInfo: {},
      currentStep: 0,
      title: '',
      fromPath: '/task/list'
    }
  },
  computed: {
    years() {
      let startYear = 2016
      let nowYear = new Date().getFullYear()
      let yearList = []
      for (let i = nowYear; i >= startYear; i--) {
        yearList.push(i)
      }
      return yearList
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        this.fromPath = newRoute.query.fromPath
        if (newRoute.name == 'taskAdd') {
          if (newRoute.query.taskInfo) {
            if (typeof newRoute.query.taskInfo == 'string') {
              this.edit(storage.get(TEMP_TASK), '编辑任务')
              this.currentStep = storage.get(TEMP_TASK).current
            } else {
              this.edit(newRoute.query.taskInfo, '编辑任务')
            }
          } else {
            this.add('新增任务')
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    add(title) {
      this.title = title
      this.taskInfo = { statisticsStartTime: moment().format('YYYY-MM-DD'), statisticsEndTime: moment().format('YYYY-MM-DD'), professionalCategory: '' }
      this.currentStep = 0
    },

    edit(record, title) {
      this.title = title
      this.taskInfo = { ...Object.assign({}, record) }
      this.currentStep = 0
    },

    close() {
      if (this.fromPath == '/task/list') {
        this.$router.push({ path: this.fromPath })
      } else {
        this.$router.push({
          path: this.fromPath,
          query: {
            taskId: this.taskInfo.id,
            taskYear: this.taskInfo.year
          }
        })
      }
      storage.remove(TEMP_TASK)
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
          storage.set(TEMP_TASK, { ...this.taskInfo, current: step })
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
.title {
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px;
  color: black;
}
</style>
