<template>
  <div>
    <a-list :grid="{ gutter: 12, column: 6 }" :data-source="reportList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div class="list-item" @click="showDetail(item)">
          <a-card>
            <a-result :title="item">
              <template #icon>
                <a-icon type="file-search" />
              </template>
            </a-result>
          </a-card>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
export default {
  name: 'Analysis',
  data() {
    return {
      reportList: ['本科教学状态数据分析报告', '本科教学质量报告']
    }
  },
  methods: {
    showDetail(item) {
      this.$router.push({
        path: '/analysis/detail',
        query: { type: item }
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-result {
  padding: 12px 24px;
}
/deep/.ant-result-title {
  font-size: 16px;
  font-weight: 600;
  color: #000;
}
/deep/.ant-result-icon > .anticon {
  font-size: 48px;
}
.list-item {
  cursor: pointer;
}
</style>
