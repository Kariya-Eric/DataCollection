<template>
  <div @blur="onBlur">
    <el-cascader
      placeholder="请选择地址"
      filterable
      style="width: 100%"
      v-model="selectOption"
      @change="changeOption"
      :props="cascaderProps"
    />
    <el-input
      type="textarea"
      :rows="3"
      placeholder="请输入详细地址"
      v-model="textarea"
      @input="changeVal"
    />
  </div>
</template>

<script>
import { cityList } from "@/api/common";

export default {
  name: "FormAddress3",
  props: ["value"],
  watch: {
    value: {
      handler(val) {
        if (!val) {
          this.selectOption = [];
          this.textarea = "";
        } else {
          let arr = val.split("/");
          this.textarea = arr[arr.length - 1];
          arr.pop();
          this.selectOption = arr;
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      textarea: "",
      selectOption: [],
      cascaderProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level } = node;
          if (level === 0) {
            //获取省份
            cityList("100000").then((res) => {
              let arr = res.value.map((item) => ({
                value: item.id,
                label: item.simpleName,
              }));
              resolve(arr);
            });
          } else {
            const { value } = node;
            cityList(value).then((res) => {
              let arr = res.value.map((item) => ({
                value: item.id,
                label: item.simpleName,
              }));
              resolve(arr);
            });
          }
        },
      },
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

    onBlur() {
      //失去焦点触发
      this.$parent.$emit("el.form.blur");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-textarea {
  margin-top: 8px;
}
</style>
