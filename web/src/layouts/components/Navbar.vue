<template>
  <div>
    <div class="navbar">
      <logo />
      <head-menu :routers="routers" />
      <head-notice :userInfo="userInfo" />
    </div>
    <page-header-layout />
  </div>
</template>

<script>
import Logo from "./Logo";
import HeadMenu from "./HeadMenu";
import { mapActions, mapState } from "vuex";
import HeadNotice from "./HeadNotice";
import PageHeaderLayout from "../PageHeaderLayout";
import { constantRouterMap } from "@/router";

export default {
  components: {
    HeadNotice,
    PageHeaderLayout,
    Logo,
    HeadMenu,
  },
  computed: {
    ...mapState("user", ["userInfo", "roles"]),
  },
  data() {
    return {
      routers: constantRouterMap,
    };
  },
  methods: {
    ...mapActions("user", ["LogOut"]),
    logout() {
      this.LogOut().then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  display: flex;
  height: 54px;
  line-height: 54px;
  border-radius: 0px !important;
  background: url("~@/assets/head/head.png") repeat-x;
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
}
</style>
