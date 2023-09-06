<template>
  <div>
    <el-button type="primary" size="small" class="button" @click="showTask"
      >查看</el-button
    >
    <div class="content">{{ notice.content }}</div>
    <div class="push">{{ notice.pushTime }}</div>
    <el-divider />
  </div>
</template>

<script>
import { read } from "@/api/notice";
export default {
  name: "NoticeList",
  props: ["notice"],
  methods: {
    showTask() {
      read(this.notice.id).then((res) => {
        if (res.state) {
          this.$emit("close");
          this.$router.push({
            path: this.notice.targetLink,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 48px;
  font-weight: bold;
  font-size: 14px;
}
.push {
  font-size: 10px;
}
/deep/.el-divider--horizontal {
  margin: 8px 0;
}
.button {
  float: right;
  margin-top: 24px;
  margin-right: 24px;
}
</style>
