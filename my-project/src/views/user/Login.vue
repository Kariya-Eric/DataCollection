<template>
  <div class="main">
    <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
      <a-tabs activeKey="tab1" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
        <a-tab-pane key="tab1" tab="账户密码登录">
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px" message="账户或密码错误" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="请输入账号"
              v-decorator="[
                'account',
                {
                  rules: [{ required: true, message: '用户名不能为空' }],
                  validateTrigger: 'blur'
                }
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input-password size="large" placeholder="请输入密码" v-decorator="['password', { rules: [{ required: true, message: '密码不能为空' }], validateTrigger: 'blur' }]">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input-password>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>
      <a-form-item style="margin-top: 24px">
        <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="loginBtn" :disabled="loginBtn">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  data() {
    return {
      isLoginError: false,
      form: this.$form.createForm(this),
      loginBtn: false
    }
  },
  methods: {
    ...mapActions(['Login']),

    handleSubmit(e) {
      e.preventDefault()
      const { Login } = this
      this.loginBtn = true
      this.form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          Login(values)
            .then(res => this.loginSuccess(res))
            .catch(err => (this.isLoginError = true))
            .finally(() => {
              this.loginBtn = false
            })
        }
      })
    },

    loginSuccess(res) {
      this.$router.push({ path: '/' })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`,
        duration: 2
      })
      this.isLoginError = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
