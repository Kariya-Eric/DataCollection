<template>
  <el-container>
    <div class="app-wrapper">
      <navbar />
      <div class="main-container">
        <app-main />
      </div>
    </div>
  </el-container>
</template>

<script>
import { Navbar, AppMain } from "./components";
export default {
  name: "BasicLayout",
  components: {
    Navbar,
    AppMain,
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
