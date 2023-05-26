<template>
  <div class="main">
    <el-form
      id="formLogin"
      class="user-layout-login"
      ref="loginForm"
      :rules="loginRules"
      :model="mdl"
    >
      <el-tabs v-model="customActiveKey" stretch @tab-click="handleTabClick">
        <el-tab-pane label="账号密码登录" name="tab1">
          <el-alert
            v-if="isLoginError"
            type="error"
            show-icon
            style="margin-bottom: 24px"
            title="账户或密码错误"
          />
          <el-form-item prop="account">
            <el-input
              size="large"
              type="text"
              placeholder="账户"
              v-model="mdl.account"
              name="account"
              auto-complete="on"
            >
              <i class="el-icon-user el-input__icon" slot="prefix"> </i>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              size="large"
              :type="pwdType"
              placeholder="密码"
              v-model="mdl.password"
              name="password"
              @keyup.enter.native="handleLogin"
            >
              <i class="el-icon-lock el-input__icon" slot="prefix"> </i>
              <i slot="suffix" @click="showPwd">
                <svg-icon v-if="pwdType === 'password'" icon-class="eyeclose" />
                <svg-icon v-if="pwdType === 'text'" icon-class="eye"></svg-icon>
              </i>
            </el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="认证登录" name="tab2">
          <a @click="tempLogin">临时登录入口</a>
        </el-tab-pane>
      </el-tabs>

      <el-form-item style="margin-top: 24px">
        <el-button
          size="large"
          type="primary"
          class="login-button"
          :loading="state.loginBtnLoading"
          :disabled="state.loginBtnLoading"
          @click="handleLogin"
          >确定</el-button
        >
      </el-form-item>

      <div class="user-login-other">
        <!-- <span>其他登录方式</span> -->
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      customActiveKey: "tab1",
      loginType: 0,
      isLoginError: false,
      state: {
        time: 60,
        loginBtnLoading: false,
        loginType: 0,
        smsSendBtn: false,
      },
      mdl: {
        account: "",
        password: "",
      },
      loginRules: {
        account: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 3, message: "用户名不少3个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 3, message: "密码不少3个字符", trigger: "blur" },
        ],
      },
      pwdType: "password",
      redirect: undefined,
    };
  },
  methods: {
    ...mapActions("user", ["Login", "TempLogin"]),
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "text";
      } else {
        this.pwdType = "password";
      }
    },

    handleTabClick(tab, event) {
      this.customActiveKey = tab.name;
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.state.loginBtnLoading = true;
          this.Login(this.mdl)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.state.loginBtnLoading = false;
            })
            .catch((err) => {
              this.state.loginBtnLoading = false;
              if (err && !err.isSuccess) {
                this.isLoginError = true;
                setTimeout(() => {
                  this.isLoginError = false;
                }, 3000);
              }
            });
        } else {
          return false;
        }
      });
    },

    tempLogin() {
      this.TempLogin().then(() =>
        this.$router.push({ path: this.redirect || "/" })
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
