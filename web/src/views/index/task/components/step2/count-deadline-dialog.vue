<template>
  <dc-dialog
    title="配置统计截止时间"
    :visible.sync="visible"
    width="30%"
    :disabled="loading"
    :append-to-body="true"
    @confirm="$refs.deadlineForm.submit()"
    @close="$emit('close')"
  >
    <dc-form ref="deadlineForm" :form="deadlineForm" :items="items" :loading="loading" label-width="120px" @submit="handleSubmit" />
  </dc-dialog>
</template>

<script>
import { configEndTime } from '@/api/task'
export default {
  name: 'CountDeadlineDialog',
  props: ['taskId', 'endTime'],
  data() {
    return {
      visible: false,
      loading: false,
      deadlineForm: {},
      isBatch: false,
      items: [
        { prop: 'name', type: 'input', required: true, label: '表单名称', disabled: true },
        { prop: 'statisticsEndTime', type: 'date', required: true, label: '统计截止时间' }
      ]
    }
  },
  methods: {
    edit(records) {
      if (records.length > 1) {
        this.isBatch = true
        this.items[0] = { prop: 'name', type: 'select', required: true, label: '表单名称', multiple: true, disabled: true, options: [] }
        this.deadlineForm.name = records.map(item => item.formName)
        this.deadlineForm.formIds = records.map(item => item.formId)
        this.deadlineForm.statisticsEndTime = ''
        this.deadlineForm = Object.assign({}, this.deadlineForm)
      } else {
        this.isBatch = false
        this.items[0] = { prop: 'name', type: 'input', required: true, label: '表单名称', disabled: true }
        this.deadlineForm = { ...records[0], name: records[0].formName, formIds: [records[0].formId] }
      }
      this.$nextTick(() => this.$refs.deadlineForm.reset())
      this.visible = true
    },

    handleSubmit(flag) {
      if (flag) {
        this.loading = true
        let deadlineForm = { taskId: this.taskId, ...this.deadlineForm }
        configEndTime(deadlineForm)
          .then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.$emit('refresh', this.deadlineForm)
              this.visible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .finally(() => (this.loading = false))
      }
    }
  }
}
</script>

<style></style>
