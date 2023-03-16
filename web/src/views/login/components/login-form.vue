<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">登录 数据采集系统</div>
    <div class="login-form-sub-title">数据采集系统</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="account"
        :rules="[{ required: true, message: '用户名不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input v-model="userInfo.account" placeholder="用户名：admin">
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="pwd"
        :rules="[{ required: true, message: '密码不能为空' }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.pwd"
          placeholder="密码：admin"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            checked="rememberPassword"
            :model-value="rememberPassword"
            @change="() => (rememberPassword = !rememberPassword)"
          >
            记住密码
          </a-checkbox>
          <a-link>忘记密码</a-link>
        </div>
        <a-button type="primary" html-type="submit" long :loading="loading">
          登录
        </a-button>
        <a-button type="text" long class="login-form-register-btn">
          注册账号
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script>
  import { login } from '@/api/login';
  import { ACCESS_TOKEN, USER_NAME, USER_INFO } from '@/store/mutation-types';
  import { Notification } from '@arco-design/web-vue';
  import ls from '@/utils/storage';

  export default {
    name: 'loginForm',
    data() {
      return {
        loading: false,
        rememberPassword: true,
        userInfo: {
          account: 'admin',
          pwd: '123',
        },
        errorMessage: '',
      };
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate().then((err) => {
          if (!err) {
            this.clearCache();
            this.loading = true;
            login(this.userInfo)
              .then((res) => {
                if (res.token) {
                  this.errorMessage = '';
                  this.setCache(
                    res.token,
                    res.username,
                    res.account,
                    res.userId
                  );
                  const { redirect, ...othersQuery } =
                    this.$router.currentRoute.value.query;
                  this.$router.push({
                    name: redirect || 'Workplace',
                    query: {
                      ...othersQuery,
                    },
                  });
                  Notification.success({
                    title: '登录成功！',
                    content: '欢迎使用数据采集系统!',
                    closable: true,
                    duration: 3000,
                    style: { width: '400px' },
                  });
                } else {
                  this.errorMessage = '登录出错，请刷新重试';
                }
              })
              .finally(() => {
                this.loading = false;
              });
          }
        });
      },

      clearCache() {
        ls.remove(ACCESS_TOKEN);
        ls.remove(USER_NAME);
        ls.remove(USER_INFO);
      },

      setCache(token, username, account, userId) {
        ls.set(ACCESS_TOKEN, token);
        ls.set(USER_NAME, username);
        ls.set(USER_INFO, { account, userId });
      },
    },
  };
</script>

<style lang="less" scoped>
  .login-form {
    &-wrapper {
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
