<template>
  <span>
    <svg-icon :icon-class="icon" width="13px" height="13px" />
    <span :style="iconStyle">{{ name }}</span>
  </span>
</template>

<script>
export default {
  props: ["status", "title"],
  computed: {
    icon() {
      if (this.status == 0 || this.status == "0") {
        return "停用";
      } else if (this.status == 1 || this.status == "1") {
        return "启用中";
      } else if (this.status == 2 || this.status == "2") {
        return "未启用";
      } else if (this.status == 3 || this.status == "3") {
        return "完成";
      } else {
        return "启用中备份3";
      }
    },

    name() {
      if (this.title) {
        return this.title;
      }
      return this.icon;
    },
    iconStyle() {
      if (this.status == 0 || this.status == "0") {
        return { color: "#E23322", marginLeft: "7px" };
      } else if (this.status == 1 || this.status == "1") {
        return { color: "#2F68BD", marginLeft: "7px" };
      } else if (this.status == 2 || this.status == "2") {
        return { color: "#999999", marginLeft: "7px" };
      } else if (this.status == 3 || this.status == "3") {
        return { color: "#2B9E77", marginLeft: "7px" };
      } else {
        return { color: "#F2951B", marginLeft: "7px" };
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
