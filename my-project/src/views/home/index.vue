<template>
  <div>
    <a-spin :spinning="loading">
      <a-list :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 4 }" :data-source="taskList">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <a-card>
            <img src="@/assets/icons/nearly.svg" class="band_image" v-if="showLabel(item) == 1" />
            <img src="@/assets/icons/overdue.svg" class="band_image" v-if="showLabel(item) >= 2" />
            <div slot="title" class="img-div"><img style="widh: 36px; height: 36px" src="@/assets/icons/data_collection.svg" /><span class="title_span">数据采集</span></div>
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
import moment from 'moment'
import { taskList } from '@/api/task'
export default {
  data() {
    return {
      taskList: [],
      loading: false
    }
  },
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
    },

    // 返回2，3逾期，返回1接近逾期，返回0不显示
    showLabel(item) {
      if (item.statisticsEndTime) {
        const diff = moment(item.statisticsEndTime).diff(moment(new Date()), 'days')
        if (diff < 0) {
          return 2
        } else if (diff < 15) {
          return 1
        }
        return 0
      }
      return 3
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-card-head {
  border-bottom: none;
}
/deep/.ant-card-body {
  padding: 16px 24px 24px 24px;
}
.band_image {
  position: absolute;
  right: 0;
  top: 0;
}
.title_span {
  margin-left: 16px;
  line-height: 32px;
}
</style>
