<template>
  <el-select
    v-if="options.length > 20"
    :filter-method="filterMethod"
    filterable
    style="width: 100%"
    :placeholder="placeholder"
    v-model="selectValue"
    @change="change"
  >
    <el-option
      v-for="(item, index) in selectOptions"
      :key="index"
      :label="item[optionProps.label]"
      :value="item[optionProps.value]"
    />
  </el-select>
  <el-select
    v-else
    style="width: 100%"
    :placeholder="placeholder"
    v-model="selectValue"
    @change="change"
  >
    <el-option
      v-for="(item, index) in selectOptions"
      :key="index"
      :label="item[optionProps.label]"
      :value="item[optionProps.value]"
    />
  </el-select>
</template>

<script>
// 封装select下拉框，保证一次做多加载10条数据，超过十条则异步加载
export default {
  name: "Select",
  props: {
    options: {
      type: Array,
      default: () => {
        return [];
      },
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    value: {
      type: String,
      default: "",
    },
    optionProps: {
      type: Object,
      default: () => {
        return {
          label: "label",
          value: "value",
        };
      },
    },
  },
  data() {
    return {
      selectOptions: [],
      selectValue: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.selectValue = newVal;
    },
    options: {
      handler(newVal) {
        this.selectOptions = newVal.length > 5 ? newVal.slice(0, 20) : newVal;
      },
      immediate: true,
    },
  },
  methods: {
    filterMethod(query = "") {
      let arr = this.options.filter((item) => {
        return item[this.optionProps.label].includes(query);
      });
      if (arr.length > 20) {
        this.selectOptions = arr.slice(0, 20);
      } else {
        this.selectOptions = arr;
      }
    },

    change(value) {
      this.selectValue = value;
      this.$emit("input", value);
    },
  },
};
</script>

<style>
</style>