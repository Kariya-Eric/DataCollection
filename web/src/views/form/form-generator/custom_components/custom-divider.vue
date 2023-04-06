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
  props: {
    title: {
      type: String,
      default: "标题",
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
  }
}
</style>