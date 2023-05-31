<template>
  <el-input-number
    size="small"
    :disabled="disabled"
    controls-position="right"
    v-model="inputVal"
    :placeholder="placeholder"
    @change="changeVal"
    :precision="precision"
    :min="min"
    :max="max"
  />
</template>

<script>
export default {
  name: "CustomNumber",
  props: ["value", "disabled", "precision", "min", "max", "placeholder"],
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.inputVal =
            typeof val === "string"
              ? parseInt(val).toFixed(this.precision)
              : val.toFixed(this.precision);
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      inputVal: undefined,
    };
  },
  methods: {
    changeVal(val) {
      this.inputVal = val.toFixed(this.precision);
      this.$emit("input", this.inputVal);
    },
  },
};
</script>

<style lang="scss" scoped></style>
