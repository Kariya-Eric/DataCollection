<template>
  <div class="main-form">
    <a-result status="success" title="任务配置完成!">
      <div class="desc" style="text-align: center">
        <p style="font-size: 16px">
          <strong>任务名称：{{ taskName }}</strong>
        </p>
        <p>是否启用任务：&nbsp;&nbsp;<dc-switch v-model="enabledFlag" @change="enableTask" /></p>
      </div>
    </a-result>
    <div class="footer">
      <a-button @click="back">查看任务概览</a-button>
    </div>
  </div>
</template>

<script>
import { enableTask, getTask } from '@/api/task'
export default {
  name: 'TaskStepFourth',
  props: ['taskId'],
  data() {
    return {
      enabledFlag: 0,
      taskName: ''
    }
  },
  watch: {
    taskId: {
      handler(newVal) {
        if (newVal !== undefined) {
          getTask(newVal).then(res => {
            if (res.state) {
              this.taskName = res.value.name
              this.enabledFlag = res.value.enabledFlag
            }
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    back() {
      this.$emit('back')
    },

    enableTask(val) {
      enableTask({ id: this.taskId, enabledFlag: val }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 380px;
  p {
    margin: 30px 0;
  }
}
.main-form {
  width: 50%;
  margin: auto;
}
.footer {
  text-align: center;
  .ant-btn {
    margin-left: 24px;
  }
}
</style>
