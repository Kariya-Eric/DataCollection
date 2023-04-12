<template>
  <el-input
    prefix-icon="el-icon-message"
    clearable
    show-word-limit
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
    v-model="inputVal"
    @input="changeVal"
  />
</template>

<script>
export default {
  name: "CustomMail",
  props: ["value", "readonly", "disabled", "placeholder"],
  watch: {
    value(val) {
      this.inputVal = val;
    },
    readonly(val) {
      this.readonly = val;
    },
    disabled(val) {
      this.disabled = val;
    },
    placeholder(val) {
      this.placeholder = val;
    },
  },
  data() {
    return {
      inputVal: this.value,
    };
  },
  methods: {
    changeVal(val) {
      this.inputVal = val;
      this.$emit("input", val);
    },
  },
};
</script>

<style></style>
