<template>
  <div>
    <sidebar-logo />
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%;">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        mode="vertical"
        background-color="#001529"
        text-color="#BABBBD"
        active-text-color="#fff"
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
import SidebarLogo from './SidebarLogo.vue';

export default {
  components: { SidebarItem, SidebarLogo },
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

