<template>
  <div class="divider">
    <div class="divSpan">
      <span>{{ title }}</span>
    </div>
    <el-divider />
  </div>
</template>

<script>
export default {
  name: "CustomDivider",
  props: ["title"],
  watch: {
    title(val) {
      this.title = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.divider {
  .divSpan {
    margin: 12px;
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0.2em;
  }
}
/deep/.el-divider {
  margin: 12px 0px;
}
</style>
