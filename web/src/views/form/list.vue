<template>
  <page-header-layout title="表单列表">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>测试表单</span>
      </div>
      <el-button @click="showFormDialog"> 点击测试表单 </el-button>
    </el-card>

    <form-generator ref="formGenerator" />
  </page-header-layout>
</template>

<script>
import FormGenerator from "./form-generator/home.vue";
import PageHeaderLayout from "layouts/PageHeaderLayout";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
export default {
  name: "FormList",
  mixins: [DataCollectionMixin],
  components: {
    FormGenerator,
    PageHeaderLayout,
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
