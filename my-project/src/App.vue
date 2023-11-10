<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import storage from 'store'
import { TIME_STORE } from '@/store/mutation-types'
import store from './store'
import { Modal } from 'ant-design-vue'

export default {
  data() {
    return {
      locale: zhCN,
      timeOut: 60 * 60 * 1000, //一小时
      isTimeOut: false
    }
  },
  mounted() {
    this.$nextTick(function () {
      setInterval(this.checkTimeOut, 60 * 1000) //1分钟调用一次
    })
    window.addEventListener('mousedown', this.setLastTime)
    window.addEventListener('keydown', this.setLastTime)
  },

  methods: {
    //储存当前时间
    setLastTime() {
      return storage.set(TIME_STORE, new Date().getTime())
    },

    //获取时间
    getLastTime() {
      return storage.get(TIME_STORE)
    },

    //删除
    checkTimeOut() {
      if (this.isTimeOut || window.document.location.pathname.indexOf('/user/login') != -1) {
        return
      }
      let currentTime = new Date().getTime()
      let lastTime = this.getLastTime()
      if (currentTime - lastTime > this.timeOut) {
        this.isTimeOut = true
        //超时
        Modal.confirm({
          title: '登录已过期',
          content: '登陆信息已失效，请重新登录',
          okText: '重新登录',
          mask: false,
          icon: 'exclamation-circle',
          cancelButtonProps: { style: { display: 'none' } },
          onCancel: () => {
            store.dispatch('Logout').then(() => {
              try {
                this.isTimeOut = false
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
                this.isTimeOut = false
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
      }
    }
  }
}
</script>

<style>
@import './assets/icons/iconfont.css';
</style>
