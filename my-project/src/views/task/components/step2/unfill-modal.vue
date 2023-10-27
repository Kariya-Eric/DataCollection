<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" :labelCol="labelCol" :wrapperCol="wrapperCol" :model="model" :rules="rules">
        <a-form-model-item prop="remark">
          <a-textarea v-model="model.remark" :rows="6" placeholder="请输入不填报原因" />
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
      labelCol: { style: 'width: 0px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100%); display: inline-block;' },
      rules: {
        remark: { required: true, message: '请输入不填报原因' }
      }
    }
  },

  methods: {
    edit(row) {
      this.model = { ...row, taskId: this.taskId, isCanFill: !row.isCanFill }
      this.visible = true
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          configFillStatus(this.model)
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('refresh', this.model)
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
