<template>
  <div class="main-form">
    <el-result icon="success">
      <template slot="title"> <h1>任务配置完成</h1> </template>
      <template slot="extra">
        <el-card class="box-card">
          <p>任务名称：{{ taskName }}</p>
          <p>是否启用任务：&nbsp;&nbsp;<el-switch v-model="enabledFlag" :active-value="1" :inactive-value="0" @change="enableTask" /></p>
        </el-card>
      </template>
    </el-result>
    <div class="footer">
      <el-button @click="back" size="small">查看任务概览</el-button>
    </div>
  </div>
</template>

<script>
import { enableTask, getTask } from '@/api/task'
export default {
  name: 'AddTaskStepFourth',
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

<style lang="scss" scoped>
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
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
</style>
