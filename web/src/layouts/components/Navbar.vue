<template>
  <div>
    <sidebar-logo />
    <el-menu class="navbar" mode="horizontal">
      <hamburger
        :toggle-click="ToggleSideBar"
        :is-active="sidebar.opened"
        class="hamburger-container"
      />
      <breadcrumb />
      <div class="user-wrapper">
        <header-notice class="action"/>
        <el-dropdown class="avatar-container" trigger="hover" size="medium">
          <span class="action action-full">
            <el-avatar class="avatar" src="@/assets/images/avatar.jpg" />
            <span>欢迎您，{{ userInfo.username }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link class="inlineBlock" to="/accountcenter">
              <el-dropdown-item>
                <span>
                  <svg-icon icon-class="settings" />
                </span>
                个人中心
              </el-dropdown-item>
            </router-link>
            <router-link class="inlineBlock" to="/accountcenter/accountsetting">
              <el-dropdown-item>
                <span>
                  <svg-icon icon-class="user" />
                </span>
                个人设置
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="action">
          <a class="logout_title" href="javascript:;" @click="logout">
            <i class="el-icon-connection" style="font-size: 18px" />
            <span>&nbsp;退出登录</span>
          </a>
        </span>
      </div>
    </el-menu>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import SidebarLogo from "./Sidebar/SidebarLogo.vue";
import { mapActions, mapState } from "vuex";
import HeaderNotice from './HeaderNotice';

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SidebarLogo,
    HeaderNotice,
  },
  computed: {
    ...mapState("app", ["sidebar"]),
    ...mapState("user", ["userInfo", "roles"]),
  },
  methods: {
    ...mapActions("app", ["ToggleSideBar"]),
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
.logout_title {
  color: inherit;
  text-decoration: none;
}
.user-wrapper {
  float: right;
  height: 100%;
  .action {
    cursor: pointer;
    padding: 0 14px;
    display: inline-block;
    transition: all 0.3s;
    height: 60%;
    line-height: 64px;

    &.action-full {
      height: 100%;
    }

    .avatar {
      margin: 10px 10px 20px 0;
      vertical-align: middle;
    }
  }
}
.navbar {
  height: 64px;
  margin-left: 240px;
  line-height: 64px;
  border-radius: 0px !important;
  // background: #096dd9;
  .item {
    margin-top: 10px;
    margin-right: 40px;
  }
  .hamburger-container {
    line-height: 75px;
    height: 64px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
}
</style>
