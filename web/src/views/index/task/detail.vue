<template>
  <div>
    <span class="card-title">任务名称：&nbsp;&nbsp;{{ taskName }}</span>
    <el-card shadow="always" style="margin-top: 16px">
      <dc-search :form="queryParam" :items="searchItems" label-width="70px" okBtn="搜索" cancelBtn="重置" @submit="searchQuery" @cancel="searchReset" />

      <div class="list-header">
        <el-button-group class="button-group">
          <el-button :class="{ active: activeName == 'ALL' }" @click="() => (activeName = 'ALL')">全部</el-button>
          <el-button :class="{ active: activeName == 'FILL' }" @click="() => (activeName = 'FILL')">我填报的</el-button>
          <el-button :class="{ active: activeName == 'APPROVE' }" @click="() => (activeName = 'APPROVE')">我审核的</el-button>
        </el-button-group>
        <div class="list-header-button">
          <el-button type="primary"><svg-icon icon-class="催办" />一键催办</el-button>
        </div>
      </div>
      <detail-all-table v-if="activeName == 'ALL'" :taskId="taskId" ref="all" />
      <detail-fill-table v-if="activeName == 'FILL'" :taskId="taskId" ref="fill" />
      <detail-approve-table v-if="activeName == 'APPROVE'" :taskId="taskId" ref="approve" />
    </el-card>
  </div>
</template>

<script>
import DetailAllTable from './components/details/detail-all-table'
import DetailFillTable from './components/details/detail-fill-table'
import DetailApproveTable from './components/details/detail-approve-table'
export default {
  name: 'TaskDetail',
  components: { DetailAllTable, DetailFillTable, DetailApproveTable },
  data() {
    return {
      taskName: '',
      activeName: 'ALL',
      taskId: '',
      queryParam: {},
      searchItems: [
        { prop: 'listCategory', label: '表单大类', type: 'select', options: [{ label: '全部', value: '全部' }] },
        { prop: 'type', label: '前置表单', type: 'select', options: [] },
        { prop: 'status', label: '状态', type: 'select', options: [{ label: '全部', value: '全部' }] },
        { prop: 'name', label: '表单名称', type: 'input' }
      ]
    }
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'taskDetail') {
          this.taskId = newRoute.query.taskId
          this.taskName = newRoute.query.taskName
          this.activeName = 'ALL'
        }
      },
      immediate: true
    }
  },

  methods: {
    searchQuery() {
      if (this.activeName == 'ALL') {
        this.$refs.all.queryParam = Object.assign({}, this.queryParam)
        this.$refs.all.loadData(1)
      } else if (this.activeName == 'APPROVE') {
        this.$refs.approve.queryParam = Object.assign({}, this.queryParam)
        this.$refs.approve.loadData(1)
      } else {
        this.$refs.fill.queryParam = Object.assign({}, this.queryParam)
        this.$refs.fill.loadData(1)
      }
    },

    searchReset() {
      this.queryParam = {}
      this.searchQuery()
    }
  }
}
</script>

<style scoped lang="scss">
.button-group {
  .el-button {
    min-width: 92px;
    border: 1px solid #d9d9d9;
  }
}
.active {
  color: #ffffff;
  background: linear-gradient(180deg, #76a8f4 0%, #2f68bd 100%);
}
</style>
