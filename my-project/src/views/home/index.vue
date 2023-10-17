<template>
  <div>
    <a-spin :spinning="loading">
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 4 }" :data-source="taskList">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-card title="数据采集">
            <p>任务名称：{{ item.name }}</p>
            <p>开始时间：{{ item.statisticsStartTime }}</p>
            <p>截止时间：{{ item.statisticsEndTime }}</p>
            <a-button type="primary" style="float: right" @click="showTaskInfo(item)">进入任务</a-button>
          </a-card>
        </a-list-item>
      </a-list>
    </a-spin>
  </div>
</template>

<script>
import { taskList } from '@/api/task'
export default {
  data() {
    return {
      taskList: [],
      loading: false
    }
  },
  created() {},
  mounted() {
    this.getTaskList()
  },
  methods: {
    getTaskList() {
      this.loading = true
      taskList({})
        .then(res => {
          if (res.state) {
            this.taskList = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    showTaskInfo(task) {
      this.$router.push({
        path: '/task/detail',
        query: { taskId: task.id, taskName: task.name }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-card-head {
  border-bottom: none;
}
/deep/.ant-card-body {
  padding: 0 24px 24px 24px;
}
</style>
