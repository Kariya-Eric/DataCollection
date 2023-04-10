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

      <el-dropdown class="avatar-container" trigger="hover" size="medium">
        <div class="avatar-wrapper">
          <el-badge :value="12" class="item">
            <i class="el-icon-bell" />
          </el-badge>
          <span class="user-name">{{ userInfo.username }}</span>
          <img src="@/assets/images/avatar.jpg" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/accountcenter">
            <el-dropdown-item>
              <span style="color: gray; padding-right: 10px">
                <svg-icon icon-class="settings" />
              </span>
              个人中心
            </el-dropdown-item>
          </router-link>
          <router-link class="inlineBlock" to="/accountcenter/accountsetting">
            <el-dropdown-item>
              <span style="color: gray; padding-right: 10px">
                <svg-icon icon-class="user" />
              </span>
              个人设置
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <div @click="logout">
              <span style="color: gray; padding-right: 10px">
                <svg-icon icon-class="shut-down-line" />
              </span>
              退出登录
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import SidebarLogo from "./Sidebar/SidebarLogo.vue";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SidebarLogo,
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
  .avatar-container {
    height: 60px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-name {
        float: left;
        margin-right: 5px;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        color: #409eff;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>
