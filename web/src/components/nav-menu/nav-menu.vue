<template>
  <div class="menu-wrapper">
      <nav-logo />
    <side-menu :menus="menus" @select="onSelect"></side-menu>
  </div>
</template>

<script>
/**
 * 左侧菜单导航组件，内置了样式、菜单切换和布局切换支持
 */
import SideMenu from "./menu";
import { menus } from "@/router/menu";
import NavLogo from "../nav-logo";

export default {
  name: "nav-menu",
  components: {
    SideMenu,
    NavLogo,
  },
  data() {
    return {
      // 当前已选中的菜单
      selectedKeys: [],
      menus: menus,
    };
  },
  computed: {},
  created() {},
  methods: {
    onSelect(value) {
      this.$emit("select", value);
    },
  },
};
</script>
<style lang="less" scoped>
.menu-wrapper {
  background-color: white;
  color: #000;
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  :deep(.arco-menu) {
    ::-webkit-scrollbar {
      width: 12px;
      height: 4px;
    }

    ::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 7px;
      background-color: var(--color-text-4);
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }
}
</style>
