<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false">
    <a-spin :spinning="loading">
      <a-form-model ref="form" :labelCol="labelCol" :wrapperCol="wrapperCol" :model="model" :rules="rules">
        <a-form-model-item label="表单名称">
          <a-input v-model="model.name" disabled v-if="!isBatch" />
          <a-select v-model="model.formIds" disabled v-else mode="multiple">
            <a-select-option v-for="item in options" :key="item.formId" :value="item.formId">{{ item.formName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="统计截止时间" prop="statisticsEndTime">
          <dc-date v-model="model.statisticsEndTime" format="YYYY-MM-DD" placeholder="请选择统计截止时间" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { configEndTime } from '@/api/task'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'CountDeadlineModal',
  props: ['taskId', 'endTime', 'options'],
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      labelCol: { style: 'width: 110px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 100px); display: inline-block;' },
      isBatch: false,
      rules: {
        statisticsEndTime: [{ required: true, message: '请选择统计截止时间' }]
      }
    }
  },
  methods: {
    edit(records) {
      if (Array.isArray(records)) {
        this.isBatch = true
        this.model.formIds = records
        this.model.statisticsEndTime = ''
        this.model = Object.assign({}, this.model)
      } else {
        this.isBatch = false
        this.model = { ...records, name: records.formName, formIds: [records.formId] }
      }
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
          let model = { taskId: this.taskId, ...this.model }
          configEndTime(model)
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
