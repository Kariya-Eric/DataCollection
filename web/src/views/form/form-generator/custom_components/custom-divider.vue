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
    conf: {
      // 组件的config 配置
      type: Object,
    },
  },
  watch: {
    conf(val) {
      this.title = val.__config__.title;
    },
  },
  data() {
    return {
      title: this.conf.__config__.title,
    };
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
