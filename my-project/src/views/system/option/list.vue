<template>
  <a-row :gutter="12">
    <a-col :span="6">
      <a-card title="选项目录">
        <template slot="extra">
          <a-button type="primary" @click="$refs.categoryModal.add(searchYear)">添加目录</a-button>
        </template>
        <a-spin :spinning="treeLoading">
          <a-form-item label="年份" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select v-model="searchYear" style="width: 100%" placeholder="请选择年份" @change="val => getDictionaryTree(val)">
              <a-select-option v-for="(year, i) in yearList" :value="year" :key="i">{{ year }}</a-select-option>
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
            <template slot="custom" slot-scope="item">
              <span style="margin-left: 8px">{{ item.name }}</span>
              <span class="custom-tree-node">
                <dc-icon type="icon-dc_edit_empty" style="color: #2f68bd" @click.stop="$refs.categoryModal.edit(item.dataRef, '修改选项值', searchYear)" />
                <a-popconfirm title="确认删除吗？" @confirm="delOption(item.dataRef)">
                  <dc-icon type="icon-dc_empty" @click.stop style="color: #e23322" />
                </a-popconfirm>
              </span>
            </template>
          </a-tree>
        </a-spin>
      </a-card>
    </a-col>
    <a-col :span="9">
      <a-card title="选项">
        <template slot="extra" v-if="selectedKeys.length > 0">
          <a-button type="primary" @click="$refs.optionBatchModal.show(optDataSource, selectedKeys)">批量编辑选项</a-button>
          <a-button type="primary" style="margin-left: 12px" @click="$refs.optionModal.add(selectedKeys, searchYear)">添加选项</a-button>
        </template>
        <a-empty v-if="selectedKeys.length == 0">
          <span slot="description">请先选择一行选项！</span>
        </a-empty>
        <vxe-table v-else border align="center" :loading="optLoading" ref="optTable" :data="optDataSource" :radio-config="{ highlight: true }" @radio-change="radioChangeEvent">
          <vxe-column type="radio" width="60"> </vxe-column>
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="选项名称" :edit-render="{ autofocus: '.ant-input' }">
            <template #edit="scope">
              <a-input v-model="scope.row.name" placeholder="请输入选项名称"></a-input>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="100">
            <template #default="{ row }">
              <a @click="$refs.optionModal.edit(row, '编辑选项', selectedKeys, searchYear)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该行吗？" @confirm="deleteOptRow(row)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </a-card>
    </a-col>

    <a-col :span="9">
      <a-card title="选项值">
        <template slot="extra" v-if="optSelectedRowKeys.length > 0">
          <a-button type="primary" @click="$refs.optvalBatchModal.show(optValueDataSource, optSelectedRowKeys)">批量修改选项值</a-button>
          <a-button type="primary" style="margin-left: 12px" @click="$refs.optvalModal.add(optSelectedRowKeys, searchYear)">添加选项值</a-button>
        </template>
        <a-empty v-if="optSelectedRowKeys.length == 0">
          <span slot="description">请先选择一行选项！</span>
        </a-empty>
        <vxe-table v-else :loading="optValueLoading" border align="center" ref="optValueTable" :data="optValueDataSource">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="选项值" :edit-render="{ autofocus: '.ant-input' }">
            <template #edit="scope">
              <a-input v-model="scope.row.name" placeholder="请输入选项值"></a-input>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="100">
            <template #default="{ row }">
              <a @click="$refs.optvalModal.edit(row, '编辑选项值', optSelectedRowKeys, searchYear)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除该行吗？" @confirm="deleteOptValueRow(row)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </a-card>
    </a-col>
    <category-modal ref="categoryModal" @refresh="getDictionaryTree(searchYear)" />
    <option-modal ref="optionModal" @refresh="getOptionData" />
    <optval-modal ref="optvalModal" :parentName="optSelectName" @refresh="getOptionValueData" />
    <option-batch-modal ref="optionBatchModal" @refresh="getOptionData" />
    <optval-batch-modal ref="optvalBatchModal" @refresh="getOptionValueData" />
  </a-row>
</template>

<script>
import CategoryModal from './components/category-modal.vue'
import OptionModal from './components/option-modal.vue'
import OptvalModal from './components/optval-modal.vue'
import OptionBatchModal from './components/option-batch-modal.vue'
import OptvalBatchModal from './components/optval-batch-modal.vue'
import { getDictionaryTree, listAll, delOption } from '@/api/system/option'
export default {
  components: { CategoryModal, OptionModal, OptvalModal, OptionBatchModal, OptvalBatchModal },
  data() {
    return {
      labelCol: { style: 'width: 60px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 60px); display: inline-block;' },
      optDataSource: [],
      optLoading: false,
      optSelectedRowKeys: [],
      optSelectName: '',
      optValueDataSource: [],
      optValueLoading: false,
      treeLoading: false,
      searchYear: new Date().getFullYear(),
      selectedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
      replaceFields: {
        title: 'name',
        key: 'id'
      },
      treeData: []
    }
  },
  computed: {
    yearList() {
      let startYear = 2018
      let nowYear = new Date().getFullYear()
      let years = []
      for (let i = nowYear; i >= startYear; i--) {
        years.push(i)
      }
      return years
    }
  },
  created() {
    this.getDictionaryTree(this.searchYear)
  },
  methods: {
    deleteOptRow(row) {
      this.onOptClearSelected()
      delOption({ id: row.id }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.getOptionData()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    deleteOptValueRow(row) {
      delOption({ id: row.id }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.getOptionValueData()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    radioChangeEvent({ row }) {
      if (row.id) {
        this.optSelectedRowKeys = [row.id]
        this.optSelectName = row.name
        this.getOptionValueData()
      } else {
        this.onOptClearSelected()
      }
    },

    onOptClearSelected() {
      this.optSelectedRowKeys = []
      this.$refs.optTable.clearRadioRow()
    },

    onSelect(selectedKeys) {
      this.optSelectedRowKeys = []
      this.selectedKeys = selectedKeys
      if (this.selectedKeys.length > 0) {
        this.getOptionData()
      } else {
        this.optDataSource = []
        this.onOptClearSelected()
      }
    },

    getOptionValueData() {
      this.optValueLoading = true
      listAll({ parentId: this.optSelectedRowKeys[0], year: this.searchYear })
        .then(res => {
          if (res.state) {
            this.optValueDataSource = res.value.map(item => {
              let newItem = { ...item }
              delete newItem.children
              return newItem
            })
          }
        })
        .finally(() => (this.optValueLoading = false))
    },

    getOptionData() {
      this.optLoading = true
      listAll({ parentId: this.selectedKeys[0], year: this.searchYear })
        .then(res => {
          if (res.state) {
            this.optDataSource = res.value.map(item => {
              let newItem = { ...item }
              delete newItem.children
              return newItem
            })
          }
        })
        .finally(() => (this.optLoading = false))
    },

    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },

    getDictionaryTree(year) {
      this.treeLoading = true
      this.selectedKeys = []
      getDictionaryTree(year)
        .then(res => {
          if (res.state) {
            this.treeData = this.renderTreeData(res.value)
            this.setExpandedKeys(res.value)
            this.optSelectedRowKeys = []
          }
        })
        .finally(() => (this.treeLoading = false))
    },

    renderTreeData(treeData) {
      treeData.forEach(tree => {
        if (tree.children && tree.children.length > 0) {
          this.renderTreeData(tree.children)
        }
        if (tree.type === 'FormCollection') {
          tree.scopedSlots = { title: 'custom' }
        }
        tree.disabled = tree.type !== 'FormCollection'
      })
      return treeData
    },

    setExpandedKeys(treeData) {
      treeData.forEach(tree => {
        if (tree.children && tree.children.length > 0) {
          this.expandedKeys.push(tree.id)
          this.setExpandedKeys(tree.children)
        }
      })
    },

    delOption(record) {
      delOption({ id: record.id }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.getDictionaryTree(this.searchYear)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.custom-tree-node {
  float: right;
  .anticon {
    margin-right: 8px;
  }
  visibility: hidden;
}
.ant-tree-node-content-wrapper:hover .custom-tree-node {
  visibility: visible;
}
</style>
