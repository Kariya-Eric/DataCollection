<template>
  <a-modal
    :title="compuntedTitle"
    v-if="visible"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
    width="45%"
    destroyOnClose
  >
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
        <a-form-model-item label="校验失败提示" prop="message" :labelCol="labelColForSix" :wrapperCol="wrapperColForSix">
          <a-textarea :rows="4" v-model="model.message" placeholder="请输入校验失败提示"></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="启用">
          <dc-switch v-model="model.enabledFlag" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'dataRange'" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verificationFormulas">
          <rule-range ref="verificationFormulas" v-model="model.verificationFormulas" :drawingList="drawingList" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'unique'" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verificationFormulas">
          <rule-unique ref="verificationFormulas" v-model="model.verificationFormulas" :drawingList="drawingList" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'dateTime'" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verificationFormulas">
          <rule-date ref="verificationFormulas" v-model="model.verificationFormulas" :drawingList="drawingList" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'other'" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verificationFormulas">
          <rule-other ref="verificationFormulas" v-model="model.verificationFormulas" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'exclusivity'" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verificationFormulas">
          <rule-exclusivity ref="verificationFormulas" v-model="model.verificationFormulas" :drawingList="drawingList" :formList="formList" />
        </a-form-model-item>
        <a-form-model-item v-if="model.type == 'consistency'" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="verificationFormulas">
          <rule-consistency ref="verificationFormulas" v-model="model.verificationFormulas" :drawingList="drawingList" :formList="formList" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import RuleOther from './rule-other'
import RuleRange from './rule-range'
import RuleUnique from './rule-unique'
import RuleDate from './rule-date'
import RuleExclusivity from './rule-exclusivity'
import RuleConsistency from './rule-consistency'
import { addRule, updateRule } from '@/api/form'
export default {
  name: 'RuleModal',
  components: { RuleOther, RuleRange, RuleUnique, RuleDate, RuleExclusivity, RuleConsistency },
  props: ['drawingList', 'formId', 'formList'],
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      labelCol: { style: 'width: 0px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100%); display: inline-block;' },
      labelColForSix: { style: 'width: 110px; display: inline-block; vertical-align: inherit;' },
      wrapperColForSix: { style: 'width: calc(100% - 110px); display: inline-block;' },
      rules: {
        name: [{ required: true, message: '请输入校验名称' }],
        type: [{ required: true, message: '请输入校验类型' }],
        verifyMode: [{ required: true, message: '请输入校验模式' }],
        message: [{ required: true, message: '请输入校验失败提示' }],
        verificationFormulas: [
          {
            validator: async (rule, value, callback) => {
              let result = await this.$refs.verificationFormulas.validate()
              if (result) {
                callback(new Error(result))
              }
              callback()
            }
          }
        ]
      },
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
  watch: {
    'model.verifyMode'(newVal, oldVal) {
      if (oldVal) {
        this.$set(this.model, 'type', '')
      }
      if (newVal == 'current') {
        this.typeList = [
          { name: '数据范围校验', value: 'dataRange' },
          { name: '唯一性校验', value: 'unique' },
          { name: '时间日期校验', value: 'dateTime' },
          { name: '自定义校验', value: 'other' }
        ]
      } else {
        this.typeList = [
          { name: '数据范围校验', value: 'dataRangeOther' },
          { name: '排他性校验', value: 'exclusivity' },
          { name: '一致性校验', value: 'consistency' },
          { name: '自定义校验', value: 'other' }
        ]
      }
    },
    'model.type'(newVal) {
      if (this.$refs.form) {
        this.$refs.form.clearValidate('verificationFormulas')
        if (newVal == 'dataRange') {
          let dataRange = [
            {
              left: [{ operator: '', type: '', value: '', field: '' }],
              operator: '',
              right: [{ operator: '', type: '', value: '', field: '' }],
              and_or: ''
            }
          ]
          this.$set(this.model, 'verificationFormulas', dataRange)
        } else if (newVal == 'unique') {
          let unique = [{ table: '', fields: [] }]
          this.$set(this.model, 'verificationFormulas', unique)
        } else if (newVal == 'dateTime') {
          let dateTime = [
            {
              left: [{ operator: '', type: '', value: '', field: '' }],
              operator: '',
              right: [{ operator: '', type: '', value: '', field: '' }],
              and_or: ''
            }
          ]
          this.$set(this.model, 'verificationFormulas', dateTime)
        } else if (newVal == 'other') {
          this.$set(this.model, 'verificationFormulas', '')
        } else if (newVal == 'exclusivity') {
          let dataExclusivity = {
            left: [{ operator: '', type: 'field', value: '', field: '', formId: 'current' }],
            operator: '',
            right: [{ operator: '', type: 'field', value: '', field: '', formId: '' }],
            and_or: ''
          }
          this.$set(this.model, 'verificationFormulas', dataExclusivity)
        } else if (newVal == 'consistency') {
          let dataConsistency = [
            {
              left: [{ operator: '', type: 'field', value: '', field: '', formId: 'current' }],
              operator: '',
              right: [{ operator: '', type: 'field', value: '', field: '', formId: '' }],
              and_or: ''
            }
          ]
          this.$set(this.model, 'verificationFormulas', dataConsistency)
        }
      }
    }
  },
  methods: {
    add(title) {
      this.edit({ enabledFlag: 1 }, title)
    },

    edit(record, title) {
      this.model = Object.assign({}, record)
      this.title = title
      this.visible = true
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
      this.$emit('ok')
    },

    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          let handler
          if (!this.model.formId) {
            handler = addRule({ ...this.model, formId: this.formId })
          } else {
            handler = updateRule(this.model)
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
            .finally(() => {
              that.loading = false
            })
        } else {
          return
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
