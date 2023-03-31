<template>
  <div class="navbar">
    <div class="right-side">
      <a-dropdown>
        <span>
          <span>{{ user.user }}</span>
          <a-icon type="down" />
        </span>
        <a-menu slot="overlay">
          <a-menu-item>
            <a>个人信息</a>
          </a-menu-item>
          <a-menu-item>
            <a @click="logout">退出登录</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
/**
 * 头部导航组件，包含 logo、菜单、用户信息等，内置了样式、菜单切换和布局切换支持
 */
import { mapActions, mapState } from "vuex";
import TopMenu from "../nav-menu/menu";
import ModalModifyPassword from "./modal-modify-password";

export default {
  name: "nav-header",
  components: {
    TopMenu,
    ModalModifyPassword,
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  methods: {
    ...mapActions(["Logout"]),
    logout() {
      this.Logout().then(() => {
        this.$message.success("登出成功");
        location.href = `${process.env.VUE_APP_API_BASE_URL}/user/login`;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;
  :deep(.locale-select) {
    border-radius: 20px;
  }
}
</style>
