<template>
  <a-config-provider :locale="locale" :getPopupContainer="getPopupContainer">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'

export default {
  data() {
    return {
      locale: zhCN
    }
  },

  methods: {
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap()
      } else {
        return document.body
      }
    }
  }
}
</script>

<style>
@import './assets/icons/iconfont.css';
</style>
