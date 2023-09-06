<template>
  <div class="login-container">
    <el-form
      ref="form"
      :model="dataForm"
      :rules="rules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">密码重置</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="dataForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          v-model="dataForm.email"
          name="email"
          auto-complete="on"
          placeholder="邮箱"
          @keyup.enter.native="handleSendLink"
        />
      </el-form-item>
      <div style="display:flex; justify-content: center;">
        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleSendLink"
        >发送链接</el-button>
        <el-button
          @click.native.prevent="gotoLogin"
        >返回登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validateMinLength, validateEmail } from '@/utils/validate';
// import { sentResetPwdLink } from '@/api/account';

export default {
  name: 'ForgotPwd',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validateMinLength(value, 3)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validateMail = (rule, value, callback) => {
      if (!validateEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'));
      } else {
        callback();
      }
    };
    return {
      dataForm: {
        username: '',
        email: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        email: [{ required: true, trigger: 'blur', validator: validateMail }]
      },
      loading: false,
      redirect: undefined
    };
  },
  methods: {
    gotoLogin() {
      this.$router.push('/login');
    },
    handleSendLink() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          sentResetPwdLink(this.dataForm.username, this.dataForm.email).then(res => {
            console.log(res);
            if (res.res) {
              this.$message({
                message: '邮件发送成功，请登录邮箱查看',
                type: 'success',
                duration: 5000
              });
            } else {
              this.$message({
                message: '邮件发送失败: ' + res.message,
                type: 'error',
                duration: 50000
              });
            }
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
