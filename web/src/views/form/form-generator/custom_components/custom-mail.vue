<template>
  <el-input
    prefix-icon="el-icon-message"
    clearable
    show-word-limit
    :disabled="config.disabled"
    :readonly="config.readonly"
    :placeholder="config.placeholder"
    v-model="config.__config__.defaultValue"
    @input="changeVal"
  />
</template>

<script>
export default {
  name: "CustomMail",
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
  methods: {
    changeVal(val) {
      this.config.__config__.defaultValue = val;
      this.$emit("input", val);
    },
  },
};
</script>

<style></style>
