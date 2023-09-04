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
    prop: "numberValue",
    event: "change",
  },
  props: {
    numberValue: {
      type: [Number, String],
      default: undefined,
    },
    controls: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      insideValue: undefined,
    };
  },
  watch: {
    numberValue(newValue) {
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