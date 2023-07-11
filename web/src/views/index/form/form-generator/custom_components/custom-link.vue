<template>
  <el-input
    prefix-icon="el-icon-link"
    clearable
    :placeholder="placeholder"
    v-model="inputVal"
    @input="changeVal"
  />
</template>

<script>
export default {
  name: "CustomLink",
  props: ["value", "placeholder"],
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

<style>
</style>