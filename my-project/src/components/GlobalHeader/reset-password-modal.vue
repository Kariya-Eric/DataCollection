<template>
  <a-modal title="重置密码" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="登录密码" prop="password">
          <a-input-password allowClear v-model="model.password" placeholder="请输入登录密码" />
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="checkPwd">
          <a-input-password allowClear v-model="model.checkPwd" placeholder="请确认登录密码" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { USER_INFO } from '@/store/mutation-types'
import storage from 'store'
import { resetPwd } from '@/api/system/user'
export default {
  name: 'ResetPasswordModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {
        password: [{ required: true, message: '请输入登录密码' }],
        checkPwd: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('请再次输入登录密码'))
              } else if (value !== this.model.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },

  methods: {
    add() {
      this.model = Object.assign({}, this.model)
      this.visible = true
    },

    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          resetPwd({ account: storage.get(USER_INFO).account, newPwd: this.model.password })
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.close()
              } else {
                this.$message.error(res.message)
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
    }
  }
}
</script>

<style scoped lang="less"></style>
