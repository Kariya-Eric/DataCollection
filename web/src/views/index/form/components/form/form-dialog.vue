<template>
  <dc-dialog :visible.sync="visible" :title="title" width="35%" @confirm="$refs.formForm.submit()" :disabled="loading" @close="$refs.formForm.resetFields()">
    <dc-form :form="formForm" :items="formFormItems" ref="formForm" @submit="handleSubmit" :loading="loading" label-width="120px" />
  </dc-dialog>
</template>

<script>
import { addForm, updateForm } from '@/api/form'

export default {
  name: 'FormDialog',
  props: ['collection', 'categorys', 'name'],
  data() {
    return {
      visible: false,
      updateFlag: false,
      loading: false,
      formForm: {},
      title: '',
      formFormItems: [
        { prop: 'name', label: '所属合集', disabled: true, type: 'input' },
        { prop: 'type', label: '合集类型', disabled: true, type: 'input' },
        { prop: 'year', label: '年份', disabled: true, type: 'input' },
        { prop: 'formName', label: '表单名称', required: true, type: 'input' },
        { prop: 'formCategories', label: '表单大类', type: 'select', options: [] },
        {
          prop: 'collectTimeType',
          label: '统计时间类型',
          required: true,
          type: 'select',
          options: [
            { label: '时点', value: '时点' },
            { label: '学年', value: '学年' },
            { label: '自然年', value: '自然年' }
          ]
        },
        {
          prop: 'formType',
          label: '表单类型',
          required: true,
          type: 'radio',
          options: [
            { label: '浮动表单', value: '浮动表单' },
            { label: '固定表单', value: '固定表单' }
          ]
        },
        { prop: 'sort', label: '排序', required: true, type: 'number' },
        { prop: 'required', label: '是否必填', type: 'switch' }
      ]
    }
  },
  methods: {
    add() {
      let collection = {
        ...this.collection,
        formCollectionId: this.collection.id
      }
      this.formFormItems[4].options = this.categorys
      this.formForm = { ...collection, ...this.formForm, required: true }
      this.$nextTick(() => this.$refs.formForm.reset())
      this.updateFlag = false
      this.visible = true
    },

    edit(record) {
      let collection = { ...this.collection }
      this.formFormItems[4].options = this.categorys
      let form = { ...record, formName: record.name, formType: record.type }
      this.formForm = Object.assign({}, collection, form)
      this.$nextTick(() => this.$refs.formForm.reset())
      this.updateFlag = true
      this.visible = true
    },

    handleSubmit(flag) {
      if (flag) {
        if (this.updateFlag) {
          this.updateForm()
        } else {
          this.addForm()
        }
      }
    },

    updateForm() {
      let params = {
        ...this.formForm,
        name: this.formForm.formName,
        type: this.formForm.formType
      }
      this.loading = true
      updateForm(params)
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

    addForm() {
      let params = {
        ...this.formForm,
        name: this.formForm.formName,
        type: this.formForm.formType
      }
      this.loading = true
      addForm(params)
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
    }
  }
}
</script>

<style lang="scss" scoped></style>
