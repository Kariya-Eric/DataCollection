<template>
  <div class="notice">
    <i
      v-if="noticeNumber == 0"
      class="el-icon-bell"
      style="font-size: 18px; padding: 4px"
      @click="showNotice"
    />
    <el-badge v-else :value="noticeNumber">
      <i
        class="el-icon-bell"
        style="font-size: 18px; padding: 4px"
        @click="showNotice"
      />
    </el-badge>
    <el-dropdown
      class="avatar-container"
      trigger="hover"
      size="medium"
      @command="handleCommand"
    >
      <span class="action action-full">
        <el-avatar class="avatar" src="@/assets/images/avatar.jpg" />
        <span>{{ userInfo.username }}</span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="quit">
          <span>
            <svg-icon icon-class="user" />
          </span>
          退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <notice-dialog ref="noticeDialog" :number="noticeNumber" />
  </div>
</template>

<script>
import NoticeDialog from "./components/notice-dialog.vue";
import { getNumber } from "@/api/notice";
export default {
  name: "HeadNotice",
  props: ["userInfo"],
  components: { NoticeDialog },

  data() {
    return {
      noticeNumber: 0,
    };
  },

  created() {
    this.init();
  },

  methods: {
    showNotice() {
      this.$refs.noticeDialog.show();
    },

    init() {
      getNumber().then((res) => {
        if (res.state) {
          this.noticeNumber = res.value;
        }
      });
    },

    handleCommand(command) {
      console.log(command);
      if (command == "quit") {
        this.$emit("logout");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-badge__content {
  margin-top: 12px;
}
.notice {
  flex: 0 1 220px;
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
