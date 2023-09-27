<template>
  <page-header-wrapper
    :title="false"
    :breadcrumb="{
      props: {
        routes: customRoutes,
        itemRender: defaultItemRender
      }
    }"
  >
    <router-view />
  </page-header-wrapper>
</template>

<script>
export default {
  name: 'PageView',
  computed: {
    customRoutes() {
      let breadList = []
      breadList.push({ path: '/home', title: '首页' })
      this.$route.matched.forEach(item => {
        if (item.path) {
          let rt = { path: item.path, title: item.meta.title }
          breadList.push(rt)
        }
      })
      return breadList
    }
  },
  methods: {
    defaultItemRender(_ref) {
      let route = _ref.route
      let routes = _ref.routes
      let h = _ref.h
      return (
        (routes.indexOf(route) === routes.length - 1 && h('span', [route.title])) ||
        h(
          'router-link',
          {
            attrs: {
              to: {
                path: route.path || '/'
              }
            }
          },
          [route.title]
        )
      )
    }
  }
}
</script>
<style lang="less">
.ant-pro-page-header-wrap-page-header-warp {
  background: none;
}
.ant-breadcrumb-link {
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: bold;
}
</style>
