<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :collapsed-width="0" :width="250" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }" theme="light">
      <p v-for="i in 60" :key="i">123</p>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '250px', marginRight: '350px' }">
      <div class="center-main">
        <a-layout-content>
          <p v-for="i in 60" :key="i">123</p>
        </a-layout-content>
      </div>
    </a-layout>
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', right: 0 }" :collapsed-width="0" :width="350" theme="light">
      <p v-for="i in 60" :key="i">123</p>
    </a-layout-sider>
  </a-layout>
</template>

<script>
export default {
  name: 'FormGenerator'
}
</script>

<style lang="less">
@import './styles/home';
</style>
