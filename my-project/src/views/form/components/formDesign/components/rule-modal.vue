<template>
  <a-modal :title="compuntedTitle" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false">
    <a-spin :spinning="loading">
      <a-form-model :model="model" ref="form" v-bind="layout" :rules="rules">
        <a-form-model-item label="校验名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入校验名称" />
        </a-form-model-item>
        <a-form-model-item label="校验模式" prop="verifyMode">
          <a-radio-group v-model="model.verifyMode">
            <a-radio value="current">表内校验</a-radio>
            <a-radio value="other">表间校验</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="校验类型" prop="type">
          <a-radio-group v-model="model.type">
            <a-radio v-for="item in typeList" :key="item.value" :value="item.value">{{ item.name }}</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="校验失败提示" prop="message">
          <a-textarea v-model="model.message" placeholder="请输入校验失败提示"></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="启用">
          <dc-switch v-model="model.enabledFlag" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'dataRange'" :labelCol="{ span: 0 }" :wrapperCol="{ span: 24 }" prop="verificationFormulas">
          <rule-range ref="verificationFormulas" v-model="model.verificationFormulas" :drawingList="drawingList" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import RuleRange from './rule-range.vue'
export default {
  name: 'RuleModal',
  components: { RuleRange },
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {},
      typeList: [
        { name: '数据范围校验', value: 'dataRange' },
        { name: '唯一性校验', value: 'unique' },
        { name: '时间日期校验', value: 'dateTime' },
        { name: '自定义校验', value: 'other' }
      ]
    }
  },
  computed: {
    compuntedTitle() {
      let mode = ''
      if (this.model.verifyMode === 'current') {
        mode = '（表内校验）'
      } else if (this.model.verifyMode === 'other') {
        mode = '（表间校验）'
      }
      return `${this.title}${mode}`
    }
  },
  methods: {
    add(title) {
      this.edit({}, title)
    },

    edit(record, title) {
      this.model = Object.assign({}, record)
      this.title = title
      this.visible = true
    },

    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    handleOk() {}
  }
}
</script>

<style lang="less" scoped></style>
