<template>
  <div class="app-footer">
    <div class="app-footer-links">
      <a
        title="数据采集系统"
        href="https://gitee.com/gameplugdev/ant-element-ui"
        target="blank"
        >数据采集系统/DataCollection</a
      >
    </div>
    <div class="app-footer-copyright">
      Copyright © 2019 ~ 2020
      <a title="AntDesgin Vue" href="" target="blank">Antd</a>
    </div>
    <div>
      <a href="https://cn.vuejs.org/" target="blank"
        ><img src="@/assets/images/logo.png"
      /></a>

      <a href="https://ant.design/" target="blank"
        ><img src="@/assets/images/antd.svg"
      /></a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
};
</script>

<style lang="scss" scoped>
.app-footer {
  text-align: center;
  padding: 20px 0 30px 0;
  color: rgba(0, 0, 0, 0.45);

  .app-footer-links {
    margin-bottom: 8px;
  }

  .app-footer-copyright {
    margin-bottom: 32px;
  }

  img {
    height: 32px;
    margin-right: 16px;
  }
}
</style>
