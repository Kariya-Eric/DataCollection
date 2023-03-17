<template>
  <a-modal
    title="重置密码"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :layout="inline" ref="pwdForm" :model="pwdInfo">
      <a-spin :loading="loading">
        <a-form-item label="用户帐号" field="account">
          <a-input v-model="pwdInfo.account" :disabled="true" />
        </a-form-item>
        <a-form-item
          label="登录密码"
          field="newPwd"
          :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 6, message: '密码不能小于6位' },
          ]"
        >
          <a-input
            type="newPwd"
            v-model="pwdInfo.newPwd"
            placeholder="请输入登录密码"
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          field="confirmPwd"
          :rules="confirmPwdRules"
        >
          <a-input
            type="password"
            v-model="confirmPwd"
            placeholder="请重新输入登录密码"
          />
        </a-form-item>
      </a-spin>
    </a-form>
  </a-modal>
</template>

<script>
import { updateUserPwd } from '@/api/system/user';

export default {
  name: 'ResetPwdModal',
  data() {
    return {
      visible: false,
      pwdInfo: {},
      confirmPwd: '',
      loading: false,
      confirmPwdRules: [
        {
          validator: (_, cb) => {
            return new Promise((resolve) => {
              if (this.confirmPwd !== this.pwdInfo.password) {
                this.pwdInfo.password = '';
                this.confirmPwd = '';
                cb('两次密码不一致');
              }
              resolve();
            });
          },
        },
      ],
    };
  },
  methods: {
    show(id, account) {
      this.pwdInfo.id = id;
      this.pwdInfo.account = account;
      this.visible = true;
    },

    handleCancel() {
      this.confirmPwd = '';
      this.$refs.pwdForm.resetFields();
      this.visible = false;
    },

    handleOk() {
      this.$refs.pwdForm.validate().then((err) => {
        if (!err) {
          this.loading = true;
          updateUserPwd(this.pwdInfo)
            .then((res) => {
              if (res.status) {
                this.$message.success(res.message);
              } else {
                this.$message.warning(res.message);
              }
            })
            .finally(() => {
              this.loading = false;
              this.handleCancel();
            });
        }
      });
    },
  },
};
</script>

<style>
</style>