<template>
  <a-spin :spinning="loading">
    <a-form-model ref="form" v-bind="layouts" :model="model" :rules="rules">
      <a-form-model-item label="所属院系">
        <a-select v-model="model.orgId" :disabled="true">
          <a-select-option v-for="item in orgs" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="专业名称" prop="name">
        <a-input v-model="model.name" placeholder="请输入专业名称" :disabled="!isEdit" allowClear> </a-input>
      </a-form-model-item>
      <a-form-model-item label="校内专业代码" prop="code">
        <a-input v-model="model.code" placeholder="请输入校内专业代码" :disabled="!isEdit" allowClear> </a-input>
      </a-form-model-item>
      <a-form-model-item label="国标专业代码" prop="internationalCode">
        <a-input v-model="model.internationalCode" placeholder="请输入国标专业代码" :disabled="!isEdit" allowClear> </a-input>
      </a-form-model-item>
      <a-form-model-item label="排序" prop="sort">
        <a-input-number v-model="model.sort" :min="0" :precision="0" placeholder="请输入排序" allowClear style="width: 15%" :disabled="!isEdit" />
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
import { updateSubject } from '@/api/system/subject'
export default {
  name: 'SubjectInfo',
  mixins: [DataCollectionModalMixin],
  props: ['isEdit', 'orgs', 'subject'],
  data() {
    return {
      rules: {
        orgId: [{ required: true, message: '请选择所属院系', trigger: 'change' }],
        name: [{ required: true, message: '请输入专业名称' }],
        code: [{ required: true, message: '请输入校内专业代码' }],
        internationalCode: [{ required: true, message: '请输入国标专业代码' }],
        sort: [{ required: true, message: '请输入排序' }]
      },
      layouts: {
        labelCol: { style: 'width: 144px; display: inline-block; vertical-align: inherit;' },
        wrapperCol: { style: 'width: calc(100% - 168px); display: inline-block;' }
      }
    }
  },
  watch: {
    subject: {
      handler(newVal) {
        if (newVal) {
          this.model = Object.assign({}, newVal)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSubmit() {
      const that = this
      this.$refs.form.validate(valid => {
        that.loading = true
        if (valid) {
          updateSubject(this.model)
            .then(res => {
              if (res.state) {
                that.$message.success(res.message)
                this.$emit('refresh')
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => (that.loading = false))
        }
      })
    },
    resetForm() {
      this.$refs.form.clearValidate()
      this.model = Object.assign({}, this.subject)
    }
  }
}
</script>

<style scoped lang="less"></style>
