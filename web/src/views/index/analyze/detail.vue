<template>
  <div>
    <el-card shadow="always" style="margin-bottom: 8px">
      <!-- Query Start -->
      <dc-search label-width="80px" :items="searchItems" :form="queryParam" okBtn="搜索" cancelBtn="重置" @submit="searchQuery" @cancel="searchReset" />
      <div class="list-header">
        <span>分析报告</span>
        <div class="list-header-button">
          <el-button type="primary">导出</el-button>
          <el-button>返回</el-button>
        </div>
      </div>
    </el-card>
    <!-- Query End -->
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card shadow="always">
          <el-input placeholder="输入目录名称进行过滤" v-model="categoryFilter" clearable size="small" prefix-icon="el-icon-search" />
          <el-tree class="filter-tree" :data="categoryList" :props="categoryProps" :filter-node-method="filterNode" ref="categoryTree"></el-tree>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="always" style="margin-left: -12px">
          <p>1.学校基本情况</p>
          <p>
            xxxxx地处xxxxx，是xxxxx类院校，举办者为xxxxx，于xxxxx年开办本科。学校现有本科专业xxxxx个，其中招生专业xxxxx个，新专业xxxxx个。
            学校全日制在校生xxxxx人，折合在校生xxxxx人，其中本科生xxxxx。全校教职工xxxxx人，其中专任教师xxxxx人。学校共有xxxxx个校区，其中xxxxx个为本地校区。
            学校有国家实验室xxxxx个，院
          </p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
export default {
  name: 'AnalyzeDetail',
  mixins: [DataCollectionMixin],
  data() {
    return {
      searchItems: [
        { type: 'select', prop: 'year', label: '年份', options: [] },
        {
          type: 'select',
          prop: 'type',
          label: '报告类型',
          options: [
            { label: '本科教学状态数据分析报告', value: '本科教学状态数据分析报告' },
            { label: '本科教学质量报告', value: '本科教学质量报告' }
          ]
        }
      ],
      categoryList: [],
      categoryFilter: '',
      categoryProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    categoryFilter(val) {
      this.$refs.categoryTree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped></style>
