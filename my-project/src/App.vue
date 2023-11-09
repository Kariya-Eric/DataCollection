<template>
  <a-config-provider :locale="locale">
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
      locale: zhCN,
      timeOut:60*1000 //一分钟
    }
  },
  mounted(){
    // this.$nextTick(function(){
    //   setInterval(this.checkTimeOut,30000)
    // })

    // window.addEventListener('mousedown',this.setLastTime)
    // window.addEventListener('keydown',this.setLastTime)
  },

  methods:{

  }
}
</script>

<style>
@import './assets/icons/iconfont.css';
</style>
