<template>
  <a-modal title="配置表单大类" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="35%">
    <a-spin :spinning="loading">
      <a-form-model :model="categoryForm" v-bind="layout">
        <a-form-model-item label="所属合集">
          <a-input v-model="categoryForm.name" disabled />
        </a-form-model-item>
        <a-form-model-item label="合集类型">
          <a-input v-model="categoryForm.type" disabled />
        </a-form-model-item>
        <a-form-model-item label="年份">
          <a-input v-model="categoryForm.year" disabled />
        </a-form-model-item>
      </a-form-model>
      <a-row> <span style="margin-right: 8px">表单大类</span> <a-button type="primary" @click="insertRow">添加</a-button> </a-row>
      <vxe-table
        border
        align="center"
        style="margin-top: 12px; margin-bottom: 12px"
        ref="xTable"
        :edit-rules="tableRules"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :data="dataSource"
      >
        <vxe-column width="60">
          <template #default>
            <span class="drag-btn"><a-icon type="drag" /></span>
          </template>
          <template #header>
            <a-tooltip placement="right">
              <template slot="title">按住后可以上下拖动排序！</template>
              <a-icon type="question-circle" />
            </a-tooltip>
          </template>
        </vxe-column>
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="name" title="表单大类名称" :edit-render="{ autofocus: '.ant-input' }">
          <template #edit="scope">
            <a-input v-model="scope.row.name" placeholder="请输入表单大类名称"></a-input>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <a-popconfirm title="确认删除该行吗？" @confirm="deleteRow(row)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </a-spin>
  </a-modal>
</template>

<script>
import Sortable from 'sortablejs'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getFormCategories, saveFormCategories } from '@/api/form'
export default {
  name: 'FormCategoryModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      categoryForm: {},
      dataSource: [],
      tableRules: {
        name: [{ required: true, message: '表单大类名不能为空' }]
      }
    }
  },

  methods: {
    rowDrop() {
      this.$nextTick(() => {
        const xTable = this.$refs.xTable
        this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.drag-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            const tableData = xTable.getTableData().tableData
            const currRow = tableData.splice(oldIndex, 1)[0]
            tableData.splice(newIndex, 0, currRow)
            this.dataSource = []
            this.$nextTick(() => (this.dataSource = tableData))
          }
        })
      })
    },

    show(formCategory) {
      this.categoryForm = { ...formCategory }
      this.loadFormCategory()
      this.rowDrop()
      this.visible = true
    },

    close() {
      this.categoryForm = {}
      this.dataSource = []
      this.$emit('close')
      this.visible = false
    },

    async handleOk() {
      const $table = this.$refs.xTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      let data = $table.getTableData().tableData
      for (let i = 0; i < data.length; i++) {
        data[i].sort = i
      }
      let param = {
        formCollectionId: this.categoryForm.id,
        categories: data
      }
      saveFormCategories(param)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('ok')
            this.close()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    loadFormCategory() {
      const param = { id: this.categoryForm.id, pageBean: {} }
      this.loading = true
      getFormCategories(param)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    async insertRow() {
      const $table = this.$refs.xTable
      const errMap = await $table.validate().catch(errMap => errMap)
      if (errMap) {
        return
      }
      const newRecord = {}
      const { row: newRow } = await $table.insertAt(newRecord, -1)
      await $table.setActiveRow(newRow)
    },

    async deleteRow(row) {
      const $table = this.$refs.xTable
      await $table.remove(row)
    }
  }
}
</script>

<style scoped lang="less"></style>
