<template>
  <div>
    <a-card class="header-card">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="5" :sm="12">
              <a-form-item label="年份">
                <a-select v-model="queryParam.year" placeholder="请选择年份">
                  <a-select-option value="2023">2023</a-select-option>
                  <a-select-option value="2022">2022</a-select-option>
                  <a-select-option value="2021">2021</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="12">
              <a-form-item label="报告类型">
                <a-select v-model="queryParam.type" placeholder="请选择报告类型">
                  <a-select-option value="本科教学状态数据分析报告">本科教学状态数据分析报告</a-select-option>
                  <a-select-option value="本科教学质量报告">本科教学质量报告</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-row :gutter="24">
      <a-col :span="6">
        <a-card class="category-card">
          <template slot="title">
            <a-form-item label="目录名称" :label-col="{ span: 4 }" :wrapperCol="{ span: 20 }">
              <a-input v-model="searchVal" placeholder="请输入目录名称" />
            </a-form-item>
          </template>
          <a-tree :tree-data="category" :defaultExpandedKeys="expandedKeys" blockNode showLine></a-tree>
        </a-card>
      </a-col>
      <a-col :span="18">
        <a-card>
          <a-skeleton></a-skeleton>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { category, expandedKeys } from './category'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
export default {
  name: 'MonitorDetail',
  mixins: [DataCollectionListMixin],
  data() {
    return {
      category,
      expandedKeys,
      searchVal: ''
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'reportDetail') {
          this.queryParam.type = newRoute.query.type
          this.queryParam.year = '2023'
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    
  }
}
</script>

<style lang="less" scoped>
.header-card {
  margin-bottom: 24px;
  /deep/.ant-card-body {
    padding: 24px 24px 0 24px;
  }
}
.category-card {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
  /deep/.ant-card-body {
    overflow-y: auto;
    height: calc(64vh);
  }
}
</style>
