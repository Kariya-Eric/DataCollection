<template>
  <a-modal title="添加专业" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%">
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="所属院系">
          <a-select v-model="model.orgId"> </a-select>
        </a-form-model-item>
        <a-form-model-item label="专业名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入专业名称" allowClear> </a-input>
        </a-form-model-item>
        <a-form-model-item label="校内专业代码" prop="code" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input v-model="model.code" placeholder="请输入校内专业代码" allowClear> </a-input>
        </a-form-model-item>
        <a-form-model-item label="国标专业代码" prop="internationalCode" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-select v-model="model.internationalCode" placeholder="请输入国标专业代码" allowClear> </a-select>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="orderNo">
          <a-input-number v-model="model.orderNo" :min="0" :precision="0" placeholder="请输入排序" allowClear style="width: 50%" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <dc-switch v-model="model.status" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'SubjectModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {}
    }
  },
  methods: {
    handleOk() {},
    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    add() {
      this.model = Object.assign({}, { status: 1 })
      this.visible = true
    }
  }
}
</script>

<style></style>
