<template>
  <div>
    <div class="title">
      <span class="title-icon">&nbsp;&nbsp;{{ collectionDetail.year }}</span>
      <span class="title-name"> {{ collectionDetail.name }}</span>
    </div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="4" :sm="12">
              <a-form-item label="表单大类">
                <a-select v-model="queryParam.formCategories" placeholder="请选择表单大类"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="前置表单">
                <a-select v-model="queryParam.type" placeholder="请选择前置表单"> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="表单名称">
                <a-select v-model="queryParam.name" placeholder="请输入表单名称"> </a-select>
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
        <span>合集详情</span>
        <div class="table-operator-button">
          <a-button type="primary">配置表单大类</a-button>
          <a-button type="primary">复制表单</a-button>
          <a-button type="primary">新建表单</a-button>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
export default {
  name: 'FormDetail',
  mixins: [DataCollectionListMixin],
  data() {
    return {
      collectionDetail: {}
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'formDetail') {
          this.collectionDetail = JSON.parse(newRoute.query.collectionInfo)
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {}
}
</script>

<style scoped lang="less">
.title {
  margin-bottom: 24px;
  .title-icon {
    display: inline-block;
    width: 56px;
    height: 22px;
    background: linear-gradient(360deg, #2f68bd 0%, #76a8f4 100%);
    border-radius: 40px 2px 40px 2px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
    margin-right: 10px;
    margin-left: 12px;
  }
  .title-name {
    color: #000;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
