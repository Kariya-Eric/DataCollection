<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="所属合集">
          <a-input v-model="model.name" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item label="合集类型">
          <a-input v-model="model.type" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item label="年份">
          <a-input v-model="model.year" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item label="表单名称" prop="formName">
          <a-input v-model="model.formName" allowClear />
        </a-form-model-item>
        <a-form-model-item label="表单大类">
          <a-select v-model="model.formCategories" allowClear :getPopupContainer="target => target.parentNode">
            <a-select-option v-for="cate in categories" :key="cate.id" :value="cate.id">{{ cate.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="统计时间类型" prop="collectTimeType" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-model="model.collectTimeType" placeholer="请输入统计时间类型" allowClear :getPopupContainer="target => target.parentNode">
            <a-select-option value="时点">时点</a-select-option>
            <a-select-option value="学年">学年</a-select-option>
            <a-select-option value="自然年">自然年</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单类型" prop="formType">
          <a-radio-group v-model="model.formType" :disabled="formTypeDisabled">
            <a-radio value="浮动表单">浮动表单</a-radio>
            <a-radio value="固定表单">固定表单</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort" v-if="formTypeDisabled">
          <a-input-number v-model="model.sort" placeholder="请输入排序" style="width: 35%" :min="0" />
        </a-form-model-item>
        <a-form-model-item label="是否必填">
          <a-switch v-model="model.required" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { addForm, updateForm } from '@/api/form'
export default {
  name: 'FormModal',
  mixins: [DataCollectionModalMixin],
  props: ['collection', 'categories'],
  data() {
    return {
      labelCol: { style: 'width: 120px; display: inline-block; vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 120px); display: inline-block;' },
      rules: {
        formName: [{ required: true, message: '请输入表单名称' }],
        formType: [{ required: true, message: '请选择表单类型' }],
        sort: [{ required: true, message: '请输入排序' }],
        collectTimeType: [{ required: true, message: '请选择统计时间类型', trigger: 'change' }]
      },
      formTypeDisabled: false
    }
  },

  methods: {
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
          let param = { ...this.model, name: this.model.formName, type: this.model.formType }
          if (!this.model.id) {
            handler = addForm(param)
          } else {
            handler = updateForm(param)
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
    },

    add(title) {
      this.edit({ required: true }, title)
    },

    edit(record, title) {
      this.title = title
      let collection = { ...this.collection }
      if (record.id) {
        this.formTypeDisabled = true
        let form = { ...record, formName: record.name, formType: record.type }
        this.model = Object.assign({}, collection, form, { name: collection.name }, { type: collection.type })
      } else {
        this.formTypeDisabled = false
        let form = { ...collection, formCollectionId: this.collection.id }
        this.model = Object.assign(form, record, { id: undefined })
      }
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-select-dropdown {
  top: 32px !important;
}
</style>
