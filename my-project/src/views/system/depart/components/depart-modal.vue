<template>
  <a-modal title="添加组织" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item hidden>
          <a-input v-model="model.parentId" />
        </a-form-model-item>
        <a-form-model-item label="职能类型" prop="type">
          <a-select v-model="model.type" placeholder="请选择职能类型" allowClear>
            <a-select-option value="functional">职能部门</a-select-option>
            <a-select-option value="teaching">教学部门</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入部门名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="部门编码" prop="code">
          <a-input v-model="model.code" placeholder="请输入部门编码" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="orderNo">
          <a-input-number v-model="model.orderNo" :min="0" :precision="0" placeholder="请输入排序" allowClear style="width: 35%"></a-input-number>
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
import { addOrg } from '@/api/system/depart'
export default {
  name: 'DepartModal',
  mixins: [DataCollectionModalMixin],
  props: ['departs'],
  watch: {
    'model.type'(newVal) {
      if (newVal == 'functional') {
        this.model.parentId = this.departs[0].children.find(item => item.name === '职能部门').id
      } else if (newVal == 'teaching') {
        this.model.parentId = this.departs[0].children.find(item => item.name === '教学部门').id
      }
    }
  },

  data() {
    return {
      rules: {
        type: [{ required: true, message: '请选择职能类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入部门名称' }],
        code: [{ required: true, message: '请输入部门编码' }],
        orderNo: [{ required: true, message: '请输入排序' }]
      }
    }
  },

  methods: {
    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          addOrg(this.model)
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
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    add() {
      this.model = Object.assign({}, { status: 1 })
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less"></style>
