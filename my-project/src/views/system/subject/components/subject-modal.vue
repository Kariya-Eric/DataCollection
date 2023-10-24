<template>
  <a-modal title="添加专业" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%">
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="所属院系" prop="orgId">
          <a-select v-model="model.orgId" placeholder="请选择所属院系">
            <a-select-option v-for="item in orgs" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="专业名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入专业名称" allowClear> </a-input>
        </a-form-model-item>
        <a-form-model-item label="校内专业代码" prop="code" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input v-model="model.code" placeholder="请输入校内专业代码" allowClear> </a-input>
        </a-form-model-item>
        <a-form-model-item label="国标专业代码" prop="internationalCode" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-input v-model="model.internationalCode" placeholder="请输入国标专业代码" allowClear> </a-input>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort">
          <a-input-number v-model="model.sort" :min="0" :precision="0" placeholder="请输入排序" allowClear style="width: 50%" />
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
import { addSubject } from '@/api/system/subject'
export default {
  name: 'SubjectModal',
  mixins: [DataCollectionModalMixin],
  props: ['orgs'],
  data() {
    return {
      rules: {
        orgId: [{ required: true, message: '请选择所属院系', trigger: 'change' }],
        name: [{ required: true, message: '请输入专业名称' }],
        code: [{ required: true, message: '请输入校内专业代码' }],
        internationalCode: [{ required: true, message: '请输入国标专业代码' }],
        sort: [{ required: true, message: '请输入排序' }]
      }
    }
  },
  methods: {
    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          addSubject(this.model)
            .then(res => {
              if (res.state) {
                that.$message.success(res.message)
                this.close()
                this.$emit('refresh')
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => (that.loading = false))
        }
      })
    },
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
