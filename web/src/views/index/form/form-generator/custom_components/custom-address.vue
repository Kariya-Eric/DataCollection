<template>
  <div>
    <el-cascader
      placeholder="请选择地址"
      :options="options"
      filterable
      style="width: 100%"
    />
    <el-input
      type="textarea"
      :rows="4"
      placeholder="请输入详细地址"
      v-model="textarea"
    />
  </div>
</template>

<script>
export default {
  name: "CustomAddress",
  data() {
    return {
      options: [],
      textarea: "",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.el-textarea {
  margin-top: 8px;
}
</style>