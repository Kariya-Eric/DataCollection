<template>
  <el-input
    prefix-icon="el-icon-mobile"
    clearable
    maxlength="11"
    show-word-limit
    :disabled="config.disabled"
    :readonly="config.readonly"
  />
</template>

<script>
export default {
  name: "CustomPhone",
  props: {
    conf: {
      // 组件的config 配置
      type: Object,
    },
  },
  watch: {
    conf(val) {
      this.config = val;
    },
  },
  data() {
    return {
      config: this.conf,
    };
  },
  created() {
    console.log(this.conf);
  },
};
</script>

<style>
</style>