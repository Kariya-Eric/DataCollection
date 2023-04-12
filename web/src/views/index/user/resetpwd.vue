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
      <h3 class="title">
        密码重置
      </h3>
      <el-form-item prop="pass">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="dataForm.pass"
          type="password"
          placeholder="新密码"
        />
      </el-form-item>
      <el-form-item prop="checkPass">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          v-model="dataForm.checkPass"
          type="password"
          placeholder="确认密码"
          @keyup.enter.native="handleConfirm"
        />
      </el-form-item>
      <div style="display:flex; justify-content: center;">
        <el-button
          :loading="loading"
          type="primary"
          @click.native.prevent="handleConfirm"
        >
          确定
        </el-button>
        <el-button @click.native.prevent="gotoLogin">
          返回登录
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { resetAccountPwdWithToken } from '@/api/account';

export default {
  name: 'ResetPwd',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.dataForm.checkPass !== '') {
          this.$refs.form.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.dataForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dataForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined,
      uid: '',
      token: ''
    };
  },
  created() {
    this.uid = this.$route.query && this.$route.query.uid;
    this.token = this.$route.query && this.$route.query.token;
    console.log(this.uid);
    console.log(this.token);
  },
  methods: {
    gotoLogin() {
      this.$router.push('/login');
    },
    handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          resetAccountPwdWithToken(
            this.uid,
            this.token,
            this.dataForm.pass
          ).then(() => {
            this.$message({
              message: '更新成功，请返回重新登录',
              type: 'success',
              duration: 5000
            });
            this.$router.push('/login');
          });
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
