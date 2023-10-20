<template>
  <div>
    <div class="title">
      <span class="title-name">任务名称：&nbsp;&nbsp;{{ taskName }}</span>
    </div>

    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="4" :sm="12">
              <a-form-item label="表单大类">
                <a-select v-model="queryParam.listCategory" placeholder="请选择表单大类" allowClear> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="前置表单">
                <a-select v-model="queryParam.type" placeholder="请选择前置表单" allowClear> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="请选择状态" allowClear> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="表单名称">
                <a-input v-model="queryParam.name" placeholder="请选择状态" allowClear> </a-input>
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="12">
              <span class="table-page-search-buttons">
                <a-button type="primary" icon="search" @click="searchQuery">搜索</a-button>
                <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button-group class="button-group">
          <a-button :class="{ active: activeName == 'ALL' }" @click="() => (activeName = 'ALL')">全部</a-button>
          <a-button :class="{ active: activeName == 'FILL' }" @click="() => (activeName = 'FILL')">我填报的</a-button>
          <a-button :class="{ active: activeName == 'APPROVE' }" @click="() => (activeName = 'APPROVE')">我审核的</a-button>
        </a-button-group>
        <div class="table-operator-button">
          <a-button type="primary"><dc-icon type="icon-remind" />一键催办</a-button>
        </div>
      </div>

      <detail-all-table v-if="activeName == 'ALL'" :taskId="taskId" ref="all" />
      <detail-fill-table v-if="activeName == 'FILL'" :taskId="taskId" ref="fill" />
      <detail-approve-table v-if="activeName == 'APPROVE'" :taskId="taskId" ref="approve" />
    </a-card>
  </div>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import DetailAllTable from './components/details/detail-all-table'
import DetailFillTable from './components/details/detail-fill-table.vue'
import DetailApproveTable from './components/details/detail-approve-table.vue'
export default {
  name: 'TaskiDetail',
  mixins: [DataCollectionListMixin],
  components: { DetailAllTable, DetailFillTable, DetailApproveTable },
  data() {
    return {
      taskName: '',
      activeName: 'ALL'
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

<style scoped lang="less">
.title {
  margin: 24px 0px 24px 24px;
  .title-name {
    color: #000;
    font-size: 18px;
    font-weight: 600;
  }
}
.button-group {
  .ant-btn {
    min-width: 92px;
    border: 1px solid #d9d9d9;
  }
}
.active {
  color: #ffffff;
  background: linear-gradient(180deg, #76a8f4 0%, #2f68bd 100%);
}
</style>
