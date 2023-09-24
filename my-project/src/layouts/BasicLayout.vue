<template>
  <pro-layout
    :menus="mainMenu"
    :collapsed="collapsed"
    v-bind="settings"
    :mediaQuery="query"
    :handleCollapse="handleCollapse"
    :handleMediaQuery="handleMediaQuery"
  >
    <template v-slot:menuHeaderRender>
      <div class="logo">
        <img src="@/assets/logo.png" />
        <h1>数据采集系统</h1>
      </div>
    </template>

    <template v-slot:rightContentRender>
      <right-content />
    </template>
    <template v-slot:footerRender>
      <global-footer />
    </template>

    <router-view />
  </pro-layout>
</template>

<script>
import { mapState } from 'vuex'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'

export default {
  name: 'BasicLayout',
  components: {
    RightContent,
    GlobalFooter,
  },
  data() {
    return {
      menus: [],
      collapsed: false,
      settings: {
        layout: 'topmenu',
        theme: 'light',
        contentWidth: 'Fluid',
      },
      query: {},
    }
  },
  computed: {
    ...mapState({
      mainMenu: (state) => state.permission.permissionList,
    }),
  },
  created() {
    console.log('main', this.mainMenu)
  },
  methods: {
    handleCollapse(val) {
      this.collapsed = false
    },

    handleMediaQuery(val) {
      this.query = {}
    },
  },
}
</script>

<style lang="less">
@import './BasicLayout.less';
</style>
