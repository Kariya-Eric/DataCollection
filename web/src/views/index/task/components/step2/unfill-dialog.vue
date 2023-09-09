<template>
  <dc-dialog title="不填报原因" :visible.sync="visible" width="35%" :disabled="loading" :append-to-body="true" @confirm="$refs.unfillForm.submit()">
    <dc-form ref="unfillForm" :form="unfillForm" :items="items" :loading="loading" @submit="handleSubmit" label-width="0px" />
  </dc-dialog>
</template>

<script>
import { configFillStatus } from '@/api/task'
export default {
  name: 'UnfillDialog',
  props: ['taskId'],
  data() {
    return {
      loading: false,
      unfillForm: {},
      items: [{ type: 'textarea', prop: 'remark', required: true, rows: 6, placeholder: '请输入不填报原因' }],
      visible: false
    }
  },

  methods: {
    edit(row) {
      this.unfillForm = { ...row, taskId: this.taskId, isCanFill: !row.isCanFill }
      this.$nextTick(() => this.$refs.unfillForm.reset())
      this.visible = true
    },

    handleSubmit(flag) {
      if (flag) {
        this.loading = true
        configFillStatus(this.unfillForm)
          .then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.$emit('refresh', this.unfillForm)
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
