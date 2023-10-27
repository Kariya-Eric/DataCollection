<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="角色编码" prop="code">
          <a-input v-model="model.code" allowClear placeholder="请输入角色编码" :disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="角色名称" prop="name">
          <a-input v-model="model.name" allowClear placeholder="请输入角色名称" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <dc-switch v-model="model.enabled" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { addRole, updateRole } from '@/api/system/role'
export default {
  name: 'RoleModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {
        code: [{ required: true, message: '请输入角色编码' }],
        name: [{ required: true, message: '请输入角色名称' }]
      }
    }
  },

  methods: {
    add(title) {
      this.edit({ enabled: 1 }, title)
    },

    edit(record, title) {
      this.title = title
      this.model = Object.assign({}, record)
      if (record.id) {
        this.$nextTick(() => (this.disabled = true))
      }
      this.visible = true
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.disabled = false
      this.$refs.form.clearValidate()
    },

    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          let handler
          if (!this.model.id) {
            handler = addRole(this.model)
          } else {
            handler = updateRole(this.model)
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

<style scoped lang="less"></style>
