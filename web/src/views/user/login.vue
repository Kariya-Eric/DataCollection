<template>
  <div class="page-login">
    <user-header />
    <div :class="['error-tips', { 'is-active': !!message }]">
      <a-alert
        v-if="message"
        :message="message"
        banner
        closable
        @close="onAlertClose"
        type="error"
      />
    </div>
    <a-form-model ref="form" :model="values">
      <a-form-model-item>
        <a-input :size="size" v-model="values.account" placeholder="帐号">
          <a-icon slot="prefix" type="user" class="C999" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item>
        <a-input
          :size="size"
          v-model="values.pwd"
          type="password"
          placeholder="密码"
        >
          <a-icon slot="prefix" type="lock" class="C999" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item prop="auto">
        <a-checkbox v-model="values.auto">自动登录</a-checkbox>
      </a-form-model-item>

      <a-form-model-item class="TAC">
        <a-button
          :size="size"
          :loading="loading"
          @click="onLogin"
          type="primary"
          class="W100"
        >
          登录
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import Vue from "vue";
import UserHeader from "./modules/user-header";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { mapActions } from "vuex";
import { timeFix } from "@/utils/utils";

export default {
  components: {
    UserHeader,
  },
  data() {
    return {
      // 提交控制
      loading: false,
      // 表单尺寸，账户模块的表单都统一使用大号的
      size: "large",
      // 表单值
      values: {
        account: "",
        pwd: "",
        auto: true,
      },
      // 接口返回的错误提示
      message: "",
      // 校验规则
    };
  },

  created() {
    Vue.ls.remove(ACCESS_TOKEN);
  },

  methods: {
    ...mapActions(["Login"]),

    onLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.Login(this.values)
            .then(() => {
              const { query } = this.$route;
              this.$notification.success({
                message: "欢迎",
                description: `${timeFix()},欢迎回来!`,
              });
              this.loading = false;
              this.$router.push(query.redirect || "/");
            })
            .catch((e) => {
              this.message = e.message || "账号或密码错误";
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    onAlertClose() {
      this.message = "";
    },
  },
};
</script>
<style lang="less" scoped>
.page-login {
  width: 100%;
  .error-tips {
    margin: 0 0 10px;
    height: 37px;
    opacity: 0;
    transition: opacity 0.25s ease-in;
    &.is-active {
      opacity: 1;
    }
  }
}
</style>
