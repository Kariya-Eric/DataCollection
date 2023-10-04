<template>
  <div>
    <a-dropdown v-if="currentUser && currentUser.username" placement="bottomRight">
      <span class="ant-pro-account-avatar">
        <a-avatar size="small" class="antd-pro-global-header-index-avatar">
          {{ currentUser.username.charAt(0) }}
        </a-avatar>
        <span class="antd-pro-global-header-index-name">{{ currentUser.username }}</span>
      </span>

      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
          <a-menu-item key="center">
            <a-icon type="user" />
            个人中心
          </a-menu-item>
          <a-menu-item key="settings" @click="$refs.resetPasswordModal.add()">
            <a-icon type="setting" />
            修改密码
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="logout" @click="handleLogout">
            <a-icon type="logout" />
            退出登录
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
    <span v-else>
      <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
    </span>
    <reset-password-modal ref="resetPasswordModal" />
  </div>
</template>

<script>
import { Modal } from 'ant-design-vue'
import ResetPasswordModal from './reset-password-modal'
export default {
  name: 'AvatarDropdown',
  components: { ResetPasswordModal },
  props: {
    currentUser: {
      type: Object,
      default: () => null
    }
  },

  methods: {
    handleLogout(e) {
      Modal.confirm({
        title: '注销',
        content: '您确定要退出当前用户吗？',
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  :deep(.action) {
    margin-right: 8px;
  }
  :deep(.ant-dropdown-menu-item) {
    min-width: 160px;
  }
}
</style>
