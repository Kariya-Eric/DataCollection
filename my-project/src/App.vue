<template>
  <a-config-provider :locale="locale" :getPopupContainer="getPopupContainer">
    <div id="app" @click="isTimeOut">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import storage from 'store'
import store from './store'
import { Modal } from 'ant-design-vue'

export default {
  data() {
    return {
      locale: zhCN,
      lastTime: null,
      currentTime: null,
      timeOut: 60 * 60 * 1000 //超时时间
    }
  },

  created() {
    this.lastTime = new Date().getTime()
  },

  methods: {
    getPopupContainer(el, dialogContext) {
      if (dialogContext) {
        return dialogContext.getDialogWrap()
      } else {
        return document.body
      }
    },

    isTimeOut() {
      this.currentTime = new Date().getTime()
      if (this.currentTime - this.lastTime > this.timeOut) {
        if (storage.get(ACCESS_TOKEN)) {
          Modal.confirm({
            title: '登录已过期',
            content: '登录信息已失效，请重新登录',
            okText: '重新登录',
            mask: false,
            icon: 'exclamation-circle',
            cancelButtonProps: { style: { display: 'none' } },
            onCancel: () => {
              store.dispatch('Logout').then(() => {
                try {
                  let path = window.document.location.pathname
                  if (path != '/' && path.indexOf('/user/login') == -1) {
                    window.location.reload()
                  }
                } catch (e) {
                  window.location.reload()
                }
              })
            },
            onOk: () => {
              store.dispatch('Logout').then(() => {
                try {
                  let path = window.document.location.pathname
                  if (path != '/' && path.indexOf('/user/login') == -1) {
                    window.location.reload()
                  }
                } catch (e) {
                  window.location.reload()
                }
              })
            }
          })
        } else {
          this.lastTime = new Date().getTime()
        }
      } else {
        this.lastTime = new Date().getTime()
      }
    }
  }
}
</script>

<style>
@import './assets/icons/iconfont.css';
</style>
