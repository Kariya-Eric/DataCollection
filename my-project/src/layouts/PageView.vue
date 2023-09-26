<template>
  <page-header-wrapper
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
import { mapState } from 'vuex'
export default {
  name: 'PageView',
  computed: {
    ...mapState({
      routers: state => state.permission.permissionList
    }),
    customRoutes() {
      return []
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
