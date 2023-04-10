<template>
  <el-input
    prefix-icon="el-icon-message"
    clearable
    show-word-limit
    :disabled="config.disabled"
    :readonly="config.readonly"
    :placeholder="config.placeholder"
    v-model="inputVal"
    @change="changeVal"
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
      inputVal: "",
      config: this.conf,
    };
  },
  methods: {
    changeVal(val) {
      this.inputVal = val;
    },
  },
};
</script>

<style></style>
