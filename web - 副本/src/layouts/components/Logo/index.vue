<template>
  <div class="logo">
    <a>
      <img src="@/assets/images/logo.png" />
      <span class="head">数据采集系统</span>
    </a>
  </div>
</template>

<script>
export default {
  name: "Logo",
};
</script>

<style lang="scss" scoped>
.logo {
  flex: 0 1 250px;
  height: 54px;
  padding-left: 30px;
  transition: all 0.3s;
  line-height: 54px;

  img {
    display: inline-block;
    height: 32px;
    vertical-align: middle;
    color: #ffffff;
  }

  .head {
    font-size: 18px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    letter-spacing: 0.6px;
    color: #ffffff;
  }
}
</style>
