<template>
  <el-input-number
    class="input_number"
    v-model="insideValue"
    style="width: 100%"
    v-bind="$attrs"
    :controls="controls"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: "InputNumber",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: [Number, String],
      default: undefined,
    },
    controls: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      insideValue: undefined,
    };
  },
  watch: {
    value(newValue) {
      if (typeof newValue === "number") {
        this.insideValue = newValue;
      } else this.insideValue = undefined;
    },
  },
};
</script>

<style lang="scss" scoped>
.input_number {
  /deep/ .el-input__inner {
    text-align: left;
  }
  /deep/ .el-input__inner::placeholder {
    text-align: left;
  }
}
</style>
