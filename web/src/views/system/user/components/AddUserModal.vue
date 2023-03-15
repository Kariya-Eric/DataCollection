<template>
  <a-modal
    :title="updateFlag ? '修改用户' : '新增用户'"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :layout="inline" ref="userForm" :model="user">
      <a-form-item
        label="账号"
        field="account"
        :rules="[
          { required: true, message: '账号不能为空' },
          { minLength: 5, message: '账号长度不能小于5位' },
        ]"
      >
        <a-input v-model="user.account" />
      </a-form-item>
      <a-form-item
        label="密码"
        field="password"
        :rules="[
          { required: true, message: '密码不能为空' },
          { minLength: 6, message: '密码不能小于6位' },
        ]"
      >
        <a-input-password v-model="user.password" allow-clear />
      </a-form-item>
      <a-form-item label="确认密码" field="confirmPwd" v-if="!updateFlag">
        <a-input-password
          v-model="confirmPwd"
          placeholder="请再次输入密码"
          allow-clear
          :rules="[{ required: true, message: '重复输入密码不能为空' }]"
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
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    name: 'AddUserModal',
    data() {
      return {
        visible: false,
        updateFlag: false,
        user: {},
        confirmPwd: '',
      };
    },
    methods: {
      show(id) {
        if (id) {
          this.updateFlag = true;
        }
        this.visible = true;
      },

      handleOk() {
        this.$refs.userForm.validate().then((err) => {
          if (!err) {
            console.log(this.user);
          }
        });
      },

      handleCancel() {
        this.$refs.userForm.resetFields();
        this.visible = false;
      },
    },
  };
</script>

<style></style>
