<template>
  <div :class="wrpCls">
    <span class="badge">
      <a-badge :count="9" :overflow-count="99">
        <a-icon type="bell" />
      </a-badge>
    </span>
    <avatar-dropdown :current-user="currentUser" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import { USER_INFO } from '@/store/mutation-types'
import storage from 'store'
export default {
  name: 'RightContent',
  components: { AvatarDropdown },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    }
  },
  data() {
    return {
      currentUser: storage.get(USER_INFO)
    }
  },
  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        'ant-pro-global-header-index-light': true
      }
    }
  }
}
</script>
