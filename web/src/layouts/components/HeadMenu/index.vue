<template>
  <div class="menu">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      mode="horizontal"
    >
      <div class="menu-item">
        <menu-item
          v-for="route in routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </div>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MenuItem from "./MenuItem";
export default {
  name: "HeadMenu",
  components: { MenuItem },
  computed: {
    ...mapState("permission", ["routers"]),
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-menu.el-menu--horizontal {
  border-bottom: 0;
  background: url("~@/assets/head/head.png") no-repeat;
}
.menu {
  width: calc(100% - 500px);
}
.menu-item {
  display: flex;
}
</style>