<template>
  <el-submenu
    ref="menu"
    v-if="isSubMenu"
    :index="resolvePath(item.path)"
    :popper-append-to-body="false"
  >
    <template slot="title">
      <item :icon="buildIcon(item.meta.icon)" :title="item.meta.title" />
    </template>
    <el-menu-item
      v-for="(sub, index) in item.children.filter((item) => !item.hidden)"
      :key="index"
      :index="resolvePath(sub.path)"
    >
      <item :title="sub.meta.title" />
    </el-menu-item>
  </el-submenu>
  <el-menu-item
    ref="menu"
    v-else-if="!item.hidden"
    :index="resolvePath(item.children[0].path)"
  >
    <item
      :icon="buildIcon(item.children[0].meta.icon)"
      :title="item.children[0].meta.title"
    />
  </el-menu-item>
</template>

<script>
import Item from "./Item";
import path from "path";
import { validateURL } from "@/utils/validate";
export default {
  name: "MenuRender",
  components: { Item },
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  watch: {
    $route: {
      handler(newVal) {
        this.$nextTick(() => {
          if (!this.item.hidden) {
            this.isActive = this.$refs.menu.active;
          }
        });
      },
      immediate: true,
    },
  },
  computed: {
    isSubMenu() {
      return this.item.name != "Base" && !this.item.hidden;
    },
  },
  data() {
    return {
      isActive: false,
    };
  },
  methods: {
    resolvePath(routePath) {
      if (validateURL(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    },

    buildIcon(icon) {
      if (icon) {
        return icon + (this.isActive ? "-blue" : "-white");
      }
      return icon;
    },
  },
};
</script>

<style scoped lang="scss"></style>
