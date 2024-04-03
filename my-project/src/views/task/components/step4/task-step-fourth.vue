<template>
  <div class="main-form">
    <a-spin :spinning="loading">
      <a-result title="任务配置完成!">
        <template #icon>
          <img src="@/assets/icons/finish.svg" />
        </template>
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
    </a-spin>
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
      taskName: '',
      loading: false
    }
  },
  watch: {
    taskId: {
      handler(newVal) {
        if (newVal !== undefined) {
          this.loading = true
          getTask(newVal)
            .then(res => {
              if (res.state) {
                this.taskName = res.value.name
                this.enabledFlag = res.value.enabledFlag
              }
            })
            .finally(() => (this.loading = false))
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
      this.loading = true
      enableTask({ id: this.taskId, enabledFlag: val })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
          } else {
            this.enabledFlag = 0
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
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
