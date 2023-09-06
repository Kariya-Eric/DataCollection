<template>
  <el-input
    prefix-icon="el-icon-mobile"
    clearable
    :placeholder="placeholder"
    v-model="inputVal"
    :maxlength="!isMobile ? 11 : null"
    :show-word-limit="!isMobile"
    @input="changeVal"
  />
</template>

<script>
export default {
  name: "FormPhone",
  props: ["value", "placeholder", "isMobile"],
  watch: {
    value(val) {
      this.inputVal = val;
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
