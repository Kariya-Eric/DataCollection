<template>
  <a-row :gutter="12">
    <a-col :span="6">
      <a-card title="选项管理">
        <a-spin :spinning="treeLoading">
          <a-form-item label="年份" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
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
    <a-col :span="9">
      <a-card title="选项">
        <template slot="extra">
          <a-button type="primary">批量编辑</a-button>
          <a-button type="primary" style="margin-left: 12px">添加</a-button>
        </template>
        <a-table
          bordered
          rowKey="id"
          :dataSource="optionDataSource"
          :pagination="optionPagination"
          :loading="optionLoading"
          :rowSelection="{ selectedRowKeys: optionSelectedRowKeys, onChange: optionOnSelectChange }"
          :columns="optionColumns"
          @change="handleOptionTableChange"
        >
          <template slot="action" slot-scope="text, record">
            <a>编辑</a>
            <a-divider type="vertical" />
            <a><span style="color: red">删除</span></a>
          </template>
        </a-table>
      </a-card>
    </a-col>
    <a-col :span="9">
      <a-card title="选项值">
        <template slot="extra">
          <a-button type="primary">批量编辑</a-button>
          <a-button type="primary" style="margin-left: 12px">添加</a-button>
        </template>
        <a-table
          bordered
          rowKey="id"
          :dataSource="optionValueDataSource"
          :pagination="optionValuePagination"
          :loading="optionValueLoading"
          :rowSelection="{ selectedRowKeys: optionValueSelectedRowKeys, onChange: optionValueOnSelectChange }"
          :columns="optionValueColumns"
          @change="handleOptionValueTableChange"
        >
          <template slot="action" slot-scope="text, record">
            <a>编辑</a>
            <a-divider type="vertical" />
            <a><span style="color: red">删除</span></a>
          </template>
        </a-table>
      </a-card>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data() {
    return {
      optionDataSource: [],
      optionPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + '共' + total + '条'
        },
        showQuickJumper: true,
        showSizeJumper: true,
        total: 0
      },
      optionLoading: true,
      optionSelectedRowKeys: [],
      optionColumns: [
        { title: '序号', width: '60', align: 'center', key: 'rowIndex', customRender: (t, r, index) => parseInt(index) + 1 },
        { title: '选项', dataIndex: 'option', align: 'center', ellipsis: true },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      optionValueDataSource: [],
      optionValuePagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + '共' + total + '条'
        },
        showQuickJumper: true,
        showSizeJumper: true,
        total: 0
      },
      optionValueLoading: true,
      optionValueSelectedRowKeys: [],
      optionValueColumns: [
        { title: '序号', width: '60', align: 'center', key: 'rowIndex', customRender: (t, r, index) => parseInt(index) + 1 },
        { title: '选项值', dataIndex: 'optionValue', align: 'center', ellipsis: true },
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
  created() {},
  mounted() {},
  methods: {
    optionOnSelectChange(selectedRowKeys, selectionRows) {
      this.optionSelectedRowKeys = selectedRowKeys
    },

    optionOnClearSelected() {
      this.optionSelectedRowKeys = []
    },

    handleOptionTableChange(pagination, filters, sorter) {
      this.optionPagination = pagination
      this.loadData()
    },

    optionValueOnSelectChange(selectedRowKeys, selectionRows) {
      this.optionValueSelectedRowKeys = selectedRowKeys
    },

    optionValueOnClearSelected() {
      this.optionSelectedRowKeys = []
    },

    handleOptionValueTableChange(pagination, filters, sorter) {
      this.optionValuePagination = pagination
    },

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
