<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="合集名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入合集名称" :disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="合集类型" prop="type">
          <a-select v-model="model.type" placeholder="请选择合集类型" :disabled="disabled">
            <a-select-option value="教学基本状态数据">教学基本状态数据</a-select-option>
            <a-select-option value="其他数据">其他数据</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="年份" prop="year">
          <dc-date v-model="model.year" placeholder="请输入年份" mode="year" format="yyyy" :disabled="disabled" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { addFormCollection, updateFormCollection } from '@/api/form'
export default {
  name: 'CollectionModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入合集名称' }],
        type: [{ required: true, message: '请选择合集类型' }],
        year: [{ required: true, message: '请选择年份' }]
      }
    }
  },
  methods: {
    add(title) {
      this.edit({}, title)
    },
    edit(record, title) {
      this.title = title
      this.model = Object.assign({}, record)
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },
    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          let handler
          if (!this.model.id) {
            handler = addFormCollection(this.model)
          } else {
            handler = updateFormCollection(this.model)
          }
          handler
            .then(res => {
              if (res.state) {
                that.$message.success(res.message)
                this.$emit('ok')
                that.close()
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => (that.loading = false))
        } else {
          return
        }
      })
    }
  }
}
</script>

<style></style>
