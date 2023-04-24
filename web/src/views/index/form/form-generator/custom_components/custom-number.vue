<template>
  <el-input-number
    size="small"
    :disabled="disabled"
    controls-position="right"
    v-model="inputVal"
    @change="changeVal"
    :precision="precision"
    :min="min"
    :max="max"
  />
</template>

<script>
export default {
  name: "CustomNumber",
  props: ["value", "disabled", "precision", "min", "max"],
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

<style lang="scss" scoped>
</style>