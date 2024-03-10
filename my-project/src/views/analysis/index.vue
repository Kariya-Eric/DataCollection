<template>
  <div>
    <a-list :grid="{ gutter: 20, xs: 1, sm: 2, md: 3 }" :data-source="reportList">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <div class="list-item" @click="showDetail(index)">
          <a-card :title="item.title">
            <img class="list-icon" src="@/assets/analysis.png" alt="" />
            <p class="list-desc">{{ item.desc }}</p>
            <a-button type="primary">查看报告</a-button>
          </a-card>
        </div>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { reportList } from './report.js'
export default {
  name: 'Analysis',
  data() {
    return {
      reportList
    }
  },
  methods: {
    showDetail(index) {
      this.$router.push({
        path: '/analysis/detail',
        query: { type: index }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list-item {
  cursor: pointer;
  background: linear-gradient(180deg, rgba(201, 223, 255, 1), rgba(237, 244, 255, 1));
  border-radius: 8px;
  padding: 1px;
  .list-desc {
    color: #666;
    margin-bottom: 34px;
  }
  .list-icon {
    position: absolute;
    bottom: 13px;
    right: 23px;
    height: 55%;
  }
  /deep/.ant-card {
    background: linear-gradient(180deg, #e6f0ff 0%, #ffffff 100%);
    border: 0;
    border-radius: 8px;
    padding-top: 12px;
    .ant-card-head {
      border: 0;
      font-size: 24px;
      color: #2f68bd;
    }
    .ant-card-head-title {
      padding: 11px 0;
    }
    .ant-card-body {
      padding-top: 0;
      padding-bottom: 32px;
    }
  }
}
</style>
