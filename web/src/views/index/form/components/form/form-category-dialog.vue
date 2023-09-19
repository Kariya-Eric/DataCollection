<template>
  <dc-dialog
    :visible.sync="visible"
    title="配置表单大类"
    width="35%"
    :disabled="loading"
    @open="open"
    @close="categoryForm = { dataSource: [] }"
    @confirm="handleSubmit"
  >
    <div class="form-div">
      <el-form ref="categoryForm" :model="categoryForm" label-width="80px" size="small" :rules="rules">
        <el-form-item prop="name" label="所属合集">
          <el-input v-model="categoryForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item prop="type" label="合集类型">
          <el-input v-model="categoryForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item prop="year" label="年份">
          <el-input v-model="categoryForm.year" :disabled="true" />
        </el-form-item>
      </el-form>
      <el-row style="margin-bottom: 12px"
        ><span style="margin-left: 12px">表单大类</span
        ><el-button type="primary" icon="el-icon-plus" style="margin-left: 12px" @click="insertRow">添加</el-button>
      </el-row>
      <vxe-table
        style="margin-bottom: 24px"
        border
        ref="xTable"
        align="center"
        size="medium"
        resizable
        keep-source
        show-overflow
        max-height="400"
        :edit-rules="tableRules"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :data="categoryForm.dataSource"
      >
        <vxe-column width="60">
          <template #default>
            <span class="drag-btn"><i class="el-icon-s-operation"></i></span>
          </template>
          <template #header>
            <el-tooltip content="按住后可以上下拖动排序！" effect="dark" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="name" title="表单大类名称" :edit-render="{ autofocus: '.el-input__inner' }">
          <template #edit="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100" show-overflow>
          <template #default="{ row }">
            <el-popconfirm title="确认删除该行吗？" @confirm="deleteRow(row)">
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </dc-dialog>
</template>

<script>
import Sortable from 'sortablejs'
import { getFormCategories, saveFormCategories } from '@/api/form'
export default {
  name: 'UpdateFormCategory',
  data() {
    return {
      submitLoading: false,
      loading: false,
      visible: false,
      categoryForm: {
        dataSource: []
      },
      rules: {
        name: [{ required: true, message: '请输入合集名称' }],
        type: [{ required: true, message: '请选择合集类型' }],
        year: [{ required: true, message: '请选择年份' }]
      },

      tableRules: {
        name: [{ required: true, message: '表单大类名不能为空' }]
      }
    }
  },

  methods: {
    open() {
      this.rowDrop()
    },

    rowDrop() {
      this.$nextTick(() => {
        const xTable = this.$refs.xTable
        this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
          handle: '.drag-btn',
          onEnd: ({ newIndex, oldIndex }) => {
            const tableData = xTable.getTableData().tableData
            const currRow = tableData.splice(oldIndex, 1)[0]
            tableData.splice(newIndex, 0, currRow)
            this.categoryForm.dataSource = []
            this.$nextTick(() => (this.categoryForm.dataSource = tableData))
          }
        })
      })
    },

    show(formCategory) {
      this.categoryForm = { ...formCategory, ...this.categoryForm }
      this.loadFormCategory()
      this.visible = true
    },

    loadFormCategory() {
      const param = { id: this.categoryForm.id, pageBean: {} }
      this.loading = true
      getFormCategories(param)
        .then(res => {
          if (res.state) {
            this.categoryForm.dataSource = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    async handleSubmit() {
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
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
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

<style lang="scss" scoped>
.form-div {
  margin: 0 24px;
}
</style>
