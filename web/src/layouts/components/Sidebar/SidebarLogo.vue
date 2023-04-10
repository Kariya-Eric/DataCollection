<template>
  <div class="sidebar-logo">
    <a>
      <img src="@/assets/images/logo.png" />
      <h1>数据采集系统</h1>
    </a>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
};
</script>

<style lang="scss" scoped>
.sidebar-logo {
  position: fixed;
  height: 64px;
  padding-left: 24px;
  overflow: hidden;
  line-height: 64px;
  width: 240px;
  // background: #001529;
  transition: all 0.3s;

  img {
    display: inline-block;
    height: 32px;
    vertical-align: middle;
  }

  h1 {
    display: inline-block;
    margin: 0 0 0 12px;
    color: black;
    font-weight: 600;
    font-size: 20px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    vertical-align: middle;
  }
}
</style>
