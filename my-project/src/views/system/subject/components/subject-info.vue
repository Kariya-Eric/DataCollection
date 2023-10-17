<template>
  <a-spin :spinning="loading">
    <a-form-model ref="form" v-bind="layouts" :model="model" :rules="rules">
      <a-form-model-item label="所属院系">
        <a-select v-model="model.orgId" :disabled="true"> </a-select>
      </a-form-model-item>
      <a-form-model-item label="专业名称" prop="name">
        <a-input v-model="model.name" placeholder="请输入专业名称" :disabled="!isEdit" allowClear> </a-input>
      </a-form-model-item>
      <a-form-model-item label="校内专业代码" prop="code">
        <a-input v-model="model.code" placeholder="请输入校内专业代码" :disabled="!isEdit" allowClear> </a-input>
      </a-form-model-item>
      <a-form-model-item label="国标专业代码" prop="internationalCode">
        <a-select v-model="model.internationalCode" placeholder="请输入国标专业代码" :disabled="!isEdit" allowClear> </a-select>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="orderNo">
        <a-input-number v-model="model.orderNo" :min="0" :precision="0" placeholder="请输入排序" allowClear style="width: 15%" :disabled="!isEdit" />
      </a-form-model-item>
      <a-form-model-item label="状态">
        <dc-switch v-model="model.status" :disabled="!isEdit" />
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }" v-if="isEdit">
        <a-button type="primary" @click="handleSubmit"> 保存 </a-button>
        <a-button style="margin-left: 10px" @click="resetForm"> 重置 </a-button>
      </a-form-model-item>
    </a-form-model>
  </a-spin>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'SubjectInfo',
  mixins: [DataCollectionModalMixin],
  props: ['isEdit', 'orgs'],
  data() {
    return {
      rules: {},
      layouts: {
        labelCol: { span: 3 },
        wrapperCol: { span: 19 }
      }
    }
  },

  methods: {
    handleSubmit() {},
    resetForm() {}
  }
}
</script>

<style scoped lang="less"></style>
