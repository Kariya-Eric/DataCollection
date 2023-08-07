<template>
  <div>
    <el-input
      type="textarea"
      :rows="6"
      placeholder="请输入自定义脚本"
      v-model="otherValue"
      @input="input"
    />
  </div>
</template>

<script>
export default {
  name: "RuleOther",
  props: ["value"],
  data() {
    return {
      otherValue: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.otherValue = newVal;
    },
  },
  methods: {
    input(value) {
      this.otherValue = value;
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped lang="scss"></style>
