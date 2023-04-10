<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%;">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        active-text-color="#096dd9"
        unique-opened
      >
        <sidebar-item
          v-for="route in routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SidebarItem from './SidebarItem';

export default {
  components: { SidebarItem },
  computed: {
    ...mapState('app', ['sidebar']),
    ...mapState('permission', ['routers']),
    isCollapse() {
      return !this.sidebar.opened;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

