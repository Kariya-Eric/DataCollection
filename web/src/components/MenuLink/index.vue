<template>
  <span>
    <a href="javascript:;" @click="click">
      <slot></slot>
    </a>
    <el-divider direction="vertical" v-if="!noDivider" />
  </span>
</template>

<script>
export default {
  name: "MenuLink",
  props: {
    noDivider: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped lang="scss"></style>
