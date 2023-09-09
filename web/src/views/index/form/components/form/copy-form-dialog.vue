<template>
  <dc-dialog :visible.sync="visible" title="复制表单" width="30%" @confirm="$refs.copyForm.submit()" :disabled="loading" @close="$refs.copyForm.resetFields()">
    <dc-form :form="copyForm" :items="copyFormItems" ref="copyForm" @submit="handleSubmit" :loading="loading" label-width="100px" />
  </dc-dialog>
</template>

<script>
import { formCollectionList, getFormList, copyForm } from '@/api/form'
export default {
  name: 'CopyFormDialog',
  props: ['formId'],
  data() {
    return {
      visible: false,
      loading: false,
      copyForm: {},
      copyFormItems: [
        { prop: 'formCollectionId', type: 'select', options: [], label: '合集名称', required: true },
        { prop: 'formIds', type: 'select', multiple: true, check: true, options: [], label: '表单名称', required: true }
      ]
    }
  },

  watch: {
    'copyForm.formCollectionId'(val) {
      this.$nextTick(() => (this.copyForm.formIds = []))
      if (val) {
        this.getFormList(val)
      } else {
        this.copyFormItems[1].options = []
      }
    }
  },
  methods: {
    show() {
      this.getCollectionList()
      this.copyForm = Object.assign({}, this.copyForm)
      this.$nextTick(() => this.$refs.copyForm.reset())
      this.visible = true
    },

    getCollectionList() {
      formCollectionList({}).then(res => {
        if (res.state) {
          this.copyFormItems[0].options = res.value.rows
        }
      })
    },

    handleSubmit(flag) {
      if (flag) {
        let param = {
          formCollectionId: this.formId,
          formIds: this.copyForm.formIds.join(',')
        }
        copyForm(param)
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
    },

    getFormList(val) {
      let param = { id: val, searchParam: {} }
      getFormList(param).then(res => {
        if (res.state) {
          this.copyFormItems[1].options = res.value.rows
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.selectAll {
  margin: 8px 16px 8px 16px;
}
</style>
