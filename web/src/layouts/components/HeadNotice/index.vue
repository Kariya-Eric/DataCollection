<template>
  <div class="notice">
    <el-badge :value="12">
      <i class="el-icon-bell" style="font-size: 18px; padding: 4px" />
    </el-badge>
    <el-dropdown class="avatar-container" trigger="hover" size="medium">
      <span class="action action-full">
        <el-avatar class="avatar" src="@/assets/images/avatar.jpg" />
        <span>{{ userInfo.username }}</span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span>
            <svg-icon icon-class="user" />
          </span>
          退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "HeadNotice",
  computed: {
    ...mapState("user", ["userInfo", "roles"]),
  },
  methods: {
    ...mapActions("user", ["LogOut"]),
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-badge__content {
  margin-top: 12px;
}
.notice {
  float: right;
  height: 100%;
  color: #fff;
  padding: 0 14px;
  cursor: pointer;
  .action {
    color: #fff;
    margin-left: 36px;
    transition: all 0.3s;
    height: 60%;
    line-height: 54px;
    &.action-full {
      height: 100%;
    }
    .avatar {
      margin: 10px 10px 20px 0;
      vertical-align: middle;
    }
  }
}
</style>
