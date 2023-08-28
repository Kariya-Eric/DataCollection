<template>
  <el-dialog
    title="修改密码"
    v-loading="loading"
    :visible="visible"
    @close="onClose"
  >
    <el-form
      ref="passwordForm"
      :model="passwordForm"
      label-width="80px"
      size="small"
      :rules="rules"
    >
      <el-form-item prop="password" label="登录密码">
        <el-input
          :type="pwdType"
          v-model="passwordForm.pwd"
          placeholder="请输入登录密码"
          clearable
        />
        <i class="el-icon-lock el-input__icon" slot="prefix"> </i>
        <i slot="suffix" @click="showPwd">
          <svg-icon v-if="pwdType === 'password'" icon-class="eyeclose" />
          <svg-icon v-if="pwdType === 'text'" icon-class="eye"></svg-icon>
        </i>
      </el-form-item>
      <el-form-item prop="checkPaasword" label="确认密码">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="checkPwdType"
          v-model="passwordForm.checkPwd"
          placeholder="请再次确认密码"
          clearable
        />
        <i class="el-icon-lock el-input__icon" slot="prefix"> </i>
        <i slot="suffix" @click="showCheckPwd">
          <svg-icon v-if="checkPwdType === 'password'" icon-class="eyeclose" />
          <svg-icon v-if="checkPwdType === 'text'" icon-class="eye"></svg-icon>
        </i>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "PasswordDialog",
  data() {
    return {
      loading: false,
      visible: false,
      pwdType: "text",
      checkPwdType: "text",
      passwordForm: {},
    };
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "text";
      } else {
        this.pwdType = "password";
      }
    },
    showCheckPwd() {
      if (this.checkPwdType === "password") {
        this.checkPwdType = "text";
      } else {
        this.checkPwdType = "password";
      }
    },
  },
};
</script>

<style>
</style>