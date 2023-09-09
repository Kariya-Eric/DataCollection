<template>
  <dc-dialog
    :visible.sync="visible"
    @confirm="$refs.collectionForm.submit()"
    @close="$refs.collectionForm.resetFields()"
    :title="title"
    :disabled="loading"
    width="25%"
  >
    <dc-form ref="collectionForm" :items="formItems" :form="collectionForm" @submit="submit" :loading="loading" />
  </dc-dialog>
</template>

<script>
import { addFormCollection, updateFormCollection } from '@/api/form'
export default {
  name: 'CollectionDialog',
  props: ['name'],
  data() {
    return {
      visible: false,
      title: '',
      collectionForm: {},
      loading: false,
      updateFlag: false,
      formItems: [
        { type: 'input', label: '合集名称', prop: 'name', required: true },
        {
          type: 'select',
          label: '合集类型',
          prop: 'type',
          required: true,
          options: [
            { label: '教学基本状态数据', value: '教学基本状态数据' },
            { label: '其他数据', value: '其他数据' }
          ]
        },
        { type: 'year', label: '年份', prop: 'year', required: true }
      ]
    }
  },
  methods: {
    add() {
      this.collectionForm = Object.assign({}, {})
      this.formItems.forEach(item => (item.disabled = false))
      this.$nextTick(() => this.$refs.collectionForm.reset())
      this.updateFlag = false
      this.visible = true
    },

    edit(record) {
      this.collectionForm = Object.assign({}, record)
      this.formItems.forEach(item => (item.disabled = record.enabledFlag == 1))
      this.$nextTick(() => this.$refs.collectionForm.reset())
      this.updateFlag = true
      this.visible = true
    },

    submit(flag) {
      if (flag) {
        if (this.updateFlag) {
          this.handleUpdate()
        } else {
          this.handleAdd()
        }
      }
    },

    handleAdd() {
      this.loading = true
      addFormCollection(this.collectionForm)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleUpdate() {
      this.loading = true
      updateFormCollection(this.collectionForm)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style></style>
