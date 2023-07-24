<template>
  <div v-if="!item.hidden && item.children">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)">
          <item
            v-if="onlyOneChild.meta"
            :icon="onlyOneChild.meta.icon || item.meta.icon"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta.icon"
          :title="item.meta.title"
        />
      </template>

      <template v-for="child in item.children">
        <template v-if="!child.hidden">
          <menu-item
            v-if="child.children && child.children.length > 0"
            :key="child.path"
            :item="child"
            :base-path="resolvePath(child.path)"
          />
          <app-link v-else :key="child.name" :to="resolvePath(child.path)">
            <el-menu-item :index="resolvePath(child.path)">
              <item
                v-if="child.meta"
                :icon="child.meta.icon"
                :title="child.meta.title"
              />
            </el-menu-item>
          </app-link>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { validateURL } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";

export default {
  name: "MenuItem",
  components: { Item, AppLink },
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
  data() {
    return {
      onlyOneChild: null,
    };
  },
  methods: {
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });
      if (showingChildren.length === 1) {
        return true;
      }

      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    isExternalLink(routePath) {
      return validateURL(routePath);
    },
  },
};
</script>
<style lang="scss" scoped></style>
