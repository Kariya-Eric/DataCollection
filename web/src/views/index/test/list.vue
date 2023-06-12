<template>
  <div>
    <el-card shadow="always" class="app-card">
      <el-button @click="show">测试</el-button>
    </el-card>
    <form-generator ref="formGenerator" />
  </div>
</template>

<script>
import FormGenerator from "../form/form-generator/home";
export default {
  components: { FormGenerator },
  data() {
    return {};
  },
  methods: {
    show() {
      let row = { formProperties: null, componentProperties: null };
      this.$refs.formGenerator.show(row);
    },
  },
};
</script>

<style>
</style>