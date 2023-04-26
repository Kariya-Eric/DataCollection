<template>
  <div>
    <el-cascader
      placeholder="请选择地址"
      :options="options"
      filterable
      clearable
      style="width: 100%"
      :disabled="disabled"
      v-model="selectOption"
      @change="changeOption"
    />
    <el-input
      type="textarea"
      :rows="4"
      placeholder="请输入详细地址"
      v-model="textarea"
      :disabled="disabled"
      @input="changeVal"
    />
  </div>
</template>

<script>
export default {
  name: "CustomAddress",
  props: ["value", "disabled"],
  data() {
    return {
      options: [
        {
          value: "上海市",
          label: "上海市",
          children: [
            { value: "浦东新区", label: "浦东新区" },
            { value: "虹口区", label: "虹口区" },
            { value: "黄浦区", label: "黄浦区" },
          ],
        },
        {
          value: "安徽省",
          label: "安徽省",
          children: [
            {
              value: "马鞍山市",
              label: "马鞍山市",
              children: [
                { value: "花山区", label: "花山区" },
                { value: "雨山区", label: "雨山区" },
                { value: "向山区", label: "向山区" },
              ],
            },
            { value: "芜湖市", label: "芜湖市" },
            { value: "合肥市", label: "合肥市" },
          ],
        },
      ],
      textarea: this.value ? this.value.split("/").slice(-1) : "",
      selectOption: this.value ? this.value.split("/").pop() : [],
    };
  },
  methods: {
    changeOption(val) {
      this.selectOption = val;
      let address = "";
      this.selectOption.forEach((opt) => (address += opt + "/"));
      address += this.textarea;
      this.$emit("input", address);
    },
    changeVal(val) {
      this.textarea = val;
      let address = "";
      this.selectOption.forEach((opt) => (address += opt + "/"));
      address += this.textarea;
      this.$emit("input", address);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  margin-top: 8px;
}
</style>