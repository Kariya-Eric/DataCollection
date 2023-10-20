<template>
  <div :class="wrpCls">
    <span class="badge">
      <a-badge :count="noticeNumber" :overflow-count="99">
        <dc-icon type="icon-announce" @click="$refs.noticeModal.show()" />
      </a-badge>
    </span>
    <avatar-dropdown :current-user="currentUser" :class="prefixCls" />
    <notice-modal ref="noticeModal" :number="noticeNumber" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import { USER_INFO } from '@/store/mutation-types'
import { getNumber } from '@/api/notice'
import storage from 'store'
import NoticeModal from './Notice-Modal.vue'
export default {
  name: 'RightContent',
  components: { AvatarDropdown, NoticeModal },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    }
  },
  data() {
    return {
      currentUser: storage.get(USER_INFO),
      noticeNumber: 0
    }
  },
  mounted() {
    // 为啥不用websocket？
    this.getNotice()
  },

  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        'ant-pro-global-header-index-light': true
      }
    }
  },
  methods: {
    getNotice() {
      getNumber().then(res => {
        if (res.state) {
          this.noticeNumber = res.value
        }
      })
    }
  }
}
</script>
