<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="12">
            <a-form-item label="年份" placeholder="请选择年份">
              <a-select v-model="queryParam.year"></a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="类型">
              <a-select v-model="queryParam.type" placeholder="请选择类型">
                <a-select-option value="教学基本状态数据">教学基本状态数据</a-select-option>
                <a-select-option value="其他数据">其他数据</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="合集名称">
              <a-input v-model="queryParam.name" placeholder="请输入合集名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <span class="table-page-search-buttons">
              <a-button type="primary" icon="search">搜索</a-button>
              <a-button type="primary" icon="reload">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>合集列表</span>
      <div class="table-operator-button">
        <a-button type="primary">新建合集</a-button>
      </div>
    </div>

    <div>
      <a-table
        bordered
        rowKey="id"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        @change="handleTableChange"
      >
        <template slot="enabledFlag" slot-scope="text, record">
          <a-switch v-model="record.enabledFlag" />
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
export default {
  mixins: [DataCollectionListMixin],
  data() {
    return {
      url: {
        list: '/uc/api/formCollection/list'
      },
      columns: [
        { dataIndex: 'name', title: '合集名称', align: 'center', scopedSlots: { customRender: 'name' } },
        { dataIndex: 'type', title: '合集类型', align: 'center' },
        { dataIndex: 'year', title: '年份', align: 'center' },
        { dataIndex: 'guidFiles', title: '填报指南', align: 'center', scopedSlots: { customRender: 'guidFiles' } },
        { dataIndex: 'enabledFlag', title: '启用', align: 'center', scopedSlots: { customRender: 'enabledFlag' } },
        { dataIndex: 'action', title: '操作', width: 340, align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created() {
    this.loadData(1)
  },
  methods: {}
}
</script>

<style scoped lang="less"></style>
