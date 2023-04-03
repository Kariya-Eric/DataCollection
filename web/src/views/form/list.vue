<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>测试表单</span>
      </div>
      <el-button @click="showFormDialog"> 点击测试表单 </el-button>
    </el-card>

    <form-generator ref="formGenerator" />
  </div>
</template>

<script>
import FormGenerator from "./form-generator/views/Home.vue";
export default {
  components: {
    FormGenerator,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    showFormDialog() {
      this.$refs.formGenerator.show();
    },
  },
};
</script>

<style scoped lang="less"></style>
