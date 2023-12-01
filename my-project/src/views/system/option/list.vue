<template>
  <a-row :gutter="12">
    <a-col :span="6">
      <a-card title="选项管理">
        <template slot="extra">
          <a-button type="primary" @click="$refs.optionModal.add()">新增选项值</a-button>
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
                <dc-icon type="icon-dc_edit_empty" style="color: #2f68bd" @click.stop="$refs.optionModal.edit(item.dataRef, '修改选项值')" />
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
          <a-button type="primary" @click="saveOpt">保存</a-button>
          <a-button type="primary" style="margin-left: 12px" @click="insertOptRow">添加</a-button>
        </template>
        <a-empty v-if="selectedKeys.length == 0">
          <span slot="description">请先选择一行选项！</span>
        </a-empty>
        <vxe-table
          v-else
          border
          align="center"
          :loading="optLoading"
          ref="optTable"
          :edit-rules="optRules"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          :data="optDataSource"
          :radio-config="{ highlight: true }"
          @radio-change="radioChangeEvent"
        >
          <vxe-column type="radio" width="60"> </vxe-column>
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="选项名称" :edit-render="{ autofocus: '.ant-input' }">
            <template #edit="scope">
              <a-input v-model="scope.row.name" placeholder="请输入选项名称"></a-input>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="100">
            <template #default="{ row }">
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
          <a-button type="primary" @click="saveOptValue">保存</a-button>
          <a-button type="primary" style="margin-left: 12px" @click="insertOptValueRow">添加</a-button>
        </template>
        <a-empty v-if="optSelectedRowKeys.length == 0">
          <span slot="description">请先选择一行选项！</span>
        </a-empty>
        <vxe-table
          v-else
          :loading="optValueLoading"
          border
          align="center"
          ref="optValueTable"
          :edit-rules="optValueRules"
          :edit-config="{ trigger: 'click', mode: 'cell' }"
          :data="optValueDataSource"
        >
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="name" title="选项值" :edit-render="{ autofocus: '.ant-input' }">
            <template #edit="scope">
              <a-input v-model="scope.row.name" placeholder="请输入选项值"></a-input>
            </template>
          </vxe-column>
          <vxe-column title="操作" width="100">
            <template #default="{ row }">
              <a-popconfirm title="确认删除该行吗？" @confirm="deleteOptValueRow(row)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>
      </a-card>
    </a-col>
    <option-modal ref="optionModal" :treeData="treeData" @refresh="getDictionaryTree(searchYear)" />
  </a-row>
</template>

<script>
import OptionModal from './components/option-modal.vue'
import { getDictionaryTree, listAll, saveList, delOption } from '@/api/system/option'
export default {
  components: { OptionModal },
  data() {
    return {
      labelCol: { style: 'width: 60px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 60px); display: inline-block;' },
      optDataSource: [],
      optLoading: false,
      optSelectedRowKeys: [],
      optRules: {
        name: [{ required: true, message: '选项不能为空' }]
      },
      optValueRules: {
        name: [{ required: true, message: '选项值不能为空' }]
      },
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
    async saveOptValue() {
      const $table = this.$refs.optValueTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      let data = $table.getTableData().tableData
      this.optValueLoading = true
      saveList({ id: this.optSelectedRowKeys[0], data })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.getOptionValueData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.optValueLoading = false))
    },

    async saveOpt() {
      const $table = this.$refs.optTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      let data = $table.getTableData().tableData
      this.optLoading = true
      saveList({ id: this.selectedKeys[0], data })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.getOptionData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.optLoading = false))
    },

    async insertOptRow() {
      const $table = this.$refs.optTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      const newRecord = {}
      const { row: newRow } = await $table.insertAt(newRecord, -1)
      await $table.setActiveRow(newRow)
    },

    async insertOptValueRow() {
      const $table = this.$refs.optValueTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      const newRecord = {}
      const { row: newRow } = await $table.insertAt(newRecord, -1)
      await $table.setActiveRow(newRow)
    },

    async deleteOptRow(row) {
      const $table = this.$refs.optTable
      await $table.remove(row)
    },

    async deleteOptValueRow(row) {
      const $table = this.$refs.optValueTable
      await $table.remove(row)
    },

    radioChangeEvent({ row }) {
      if (row.id) {
        this.optSelectedRowKeys = [row.id]
        this.getOptionValueData()
      } else {
        this.$message.warning('请先保存临时数据！')
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
      listAll(this.optSelectedRowKeys[0])
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
      listAll(this.selectedKeys[0])
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
        tree.scopedSlots = { title: 'custom' }
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
