<template>
  <footer class="nav-footer">
    Copyright @2022
    <a href="https://github.com/Kariya-Eric/DataCollection" target="_blank" class="nav-footer__link">
      数据采集系统
    </a>
    <br/>
    ArcoProDesign Vue不如Antdesign Vue 一根
  </footer>
</template>

<script>
/**
 * 底部导航组件，内置版权、案号等信息，可跟随项目需求修改
 */
export default {
  name: 'nav-footer'
}
</script>

<style lang="less" scoped>
.nav-footer {
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
  padding: 32px 16px;
  &__link {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
