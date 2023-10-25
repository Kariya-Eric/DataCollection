<template>
  <a-row :gutter="12">
    <a-col :span="6">
      <a-card title="选项管理">
        <a-spin :spinning="treeLoading">
          <a-form-item label="年份" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-model="searchYear" style="width: 100%" placeholder="请选择年份">
              <a-select-option value="2023">2023</a-select-option>
            </a-select>
          </a-form-item>
          <a-tree
            :show-line="true"
            :tree-data="treeData"
            :expanded-keys="expandedKeys"
            blockNode
            :auto-expand-parent="autoExpandParent"
            @expand="onExpand"
            @select="onSelect"
            :selected-keys="selectedKeys"
            :replace-fields="replaceFields"
          >
          </a-tree>
        </a-spin>
      </a-card>
    </a-col>
    <a-col :span="18">
      <a-card>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="6" :sm="12">
                <a-form-item label="业务表名">
                  <a-input v-model="queryParam.tableName" placeholder="请输入业务表名" allowClear />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="12">
                <a-form-item label="物理表名">
                  <a-input v-model="queryParam.physicTableName" placeholder="请输入物理表名" allowClear />
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
          <span>字典列表</span>
        </div>

        <a-table bordered rowKey="id" :dataSource="dataSource" :pagination="ipagination" :loading="loading" :columns="columns" @change="handleTableChange">
          <template slot="action" slot-scope="text, record">
            <a>查看数据</a>
            <a-divider type="vertical" />
            <a>字段属性</a>
          </template>
        </a-table>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
export default {
  mixins: [DataCollectionListMixin],
  data() {
    return {
      columns: [
        { title: '序号', width: 70, align: 'center', key: 'rowIndex', customRender: (t, r, index) => parseInt(index) + 1 },
        { title: '业务表名', dataIndex: 'option' },
        { title: '物理表名', dataIndex: 'option1', align: 'center' },
        { title: '表单类型', dataIndex: 'option2', align: 'center' },
        { title: '前置表单', dataIndex: 'option3', align: 'center' },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      treeLoading: false,
      searchYear: undefined,
      selectedKeys: [],
      expandedKeys: ['0-0-0'],
      autoExpandParent: true,
      replaceFields: {
        children: 'children',
        title: 'name'
      },
      treeData: [
        {
          name: '选项值类别',
          key: '0-0',
          children: [
            {
              name: '状态数据',
              key: '0-0-0',
              children: [
                { name: '1-1 学校概况', key: '0-0-0-1' },
                { name: '1-2 学校相关党政单位', key: '0-0-0-2' },
                { name: '1-3 学校教学科研单位', key: '0-0-0-3' }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    }
  }
}
</script>

<style scoped lang="less"></style>
