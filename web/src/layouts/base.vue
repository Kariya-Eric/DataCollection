<template>
  <div>
    <a-layout>
      <a-layout-sider>
        <nav-menu />
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <nav-header />
        </a-layout-header>
        <a-layout-content>
          <nav-breadcrumb />
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import { NavHeader, NavMenu, NavBreadcrumb } from "@/components";

export default {
  name: "layout-base",
  components: {
    NavHeader,
    NavMenu,
    NavBreadcrumb,
  },
  data() {
    return {};
  },
  computed: {},
};
</script>

<style lang="less" scoped>
</style>
