<template>
  <a-modal
    :title="updateFlag ? '修改用户' : '新增用户'"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :layout="inline" ref="userForm" :model="user">
      <a-spin :loading="loading">
        <a-form-item
          label="账号"
          field="account"
          :rules="[
            { required: true, message: '账号不能为空' },
            { minLength: 5, message: '账号长度不能小于5位' },
          ]"
        >
          <a-input v-model="user.account" :disabled="updateFlag" />
        </a-form-item>
        <a-form-item
          label="密码"
          field="password"
          v-if="!updateFlag"
          :rules="[
            { required: true, message: '密码不能为空' },
            { minLength: 6, message: '密码不能小于6位' },
          ]"
        >
          <a-input-password v-model="user.password" allow-clear />
        </a-form-item>
        <a-form-item
          label="确认密码"
          field="confirmPwd"
          :rules="confirmPwdRules"
          v-if="!updateFlag"
        >
          <a-input-password
            v-model="confirmPwd"
            placeholder="请再次输入密码"
            allow-clear
          />
        </a-form-item>
        <a-form-item
          label="用户名"
          field="name"
          :rules="[{ required: true, message: '用户名不能为空' }]"
        >
          <a-input v-model="user.name" />
        </a-form-item>
        <a-form-item
          label="所属部门"
          field="orgId"
          :rules="[{ required: true, message: '所属部门不能为空' }]"
        >
          <a-input v-model="user.orgId" />
        </a-form-item>
        <a-form-item label="账户状态" field="status">
          <a-switch
            v-model="user.status"
            :checked-value="1"
            :unchecked-value="0"
          >
            <template #checked> 启用 </template>
            <template #unchecked> 禁用 </template>
          </a-switch>
        </a-form-item>
        <a-form-item
          label="手机号"
          field="mobile"
          :rules="[
            {
              length: 11,
              message: '请输入11位电话号码！',
            },
            {
              match: /^(1[3456789]|9[28])\d{9}$/,
              message: '请输入有效电话号码！',
            },
          ]"
        >
          <a-input v-model="user.mobile" />
        </a-form-item>
        <a-form-item
          label="邮箱号"
          field="email"
          :rules="[
            {
              type: 'email',
              message: '请输入有效邮箱号！',
            },
          ]"
        >
          <a-input v-model="user.email" />
        </a-form-item>
      </a-spin>
    </a-form>
  </a-modal>
</template>

<script>
import { addUser, updateUser } from '@/api/system/user';

export default {
  name: 'AddUserModal',
  data() {
    return {
      visible: false,
      updateFlag: false,
      user: {
        status: 1,
      },
      confirmPwd: '',
      loading: false,
      confirmPwdRules: [
        {
          validator: (_, cb) => {
            return new Promise((resolve) => {
              if (this.confirmPwd !== this.user.password) {
                this.user.password = '';
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
    show(id) {
      if (id) {
        this.updateFlag = true;
      } else {
        this.$refs.userForm.setFields('status', 1);
      }
      this.visible = true;
    },

    handleOk() {
      this.$refs.userForm.validate().then((err) => {
        if (!err) {
          this.loading = true;
          if (this.updateFlag) {
            addUser(this.user)
              .then((res) => {
                if (res.state) {
                  this.$message.success(res.message);
                } else {
                  this.$message.warning(res.message);
                }
              })
              .finally(() => {
                this.loading = false;
                this.$emit('refresh');
                this.handleCancel();
              });
          } else {
            updateUser(this.user)
              .then((res) => {
                if (res.state) {
                  this.$message.success(res.message);
                } else {
                  this.$message.warning(res.message);
                }
              })
              .finally(() => {
                this.loading = false;
                this.$emit('refresh');
                this.handleCancel();
              });
          }
        }
      });
    },

    handleCancel() {
      this.confirmPwd = '';
      this.$refs.userForm.resetFields();
      this.visible = false;
    },
  },
};
</script>

<style></style>
