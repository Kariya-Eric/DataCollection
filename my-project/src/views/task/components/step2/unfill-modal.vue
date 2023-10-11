<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false">
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item prop="remark">
          <a-textarea v-model="model.remark" :row="6" placeholder="请输入不填报原因" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { configFillStatus } from '@/api/task'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'UnfillModal',
  mixins: [DataCollectionModalMixin],
  props: ['taskId'],
  data() {
    return {
      rules: {
        remark: { required: true, message: '请输入不填报原因' }
      }
    }
  },

  methods: {
    edit(row) {
      this.unfillForm = { ...row, taskId: this.taskId, isCanFill: !row.isCanFill }
      this.visible = true
    },

    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          configFillStatus(this.unfillForm)
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('refresh', this.unfillForm)
                this.close()
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => (this.loading = false))
        } else {
          return
        }
      })
    }
  }
}
</script>

<style></style>
