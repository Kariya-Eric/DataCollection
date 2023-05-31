<template>
  <page-header-layout title="任务列表">
    <el-card shadow="always" class="app-card">
      <el-descriptions style="margin-top: 12px; margin-left: 12px">
        <el-descriptions-item label="合集名称">{{
          collectionDetail.name
        }}</el-descriptions-item>
        <el-descriptions-item label="年份">{{
          collectionDetail.year
        }}</el-descriptions-item>
        <el-descriptions-item>
          <el-button size="small">配置表单大类</el-button>
          <el-button size="small" @click="addForm">新建表单</el-button>
        </el-descriptions-item>
      </el-descriptions>
      <el-table
        style="margin-top: 12px"
        :loading="loading"
        size="small"
        :border="true"
        :data="dataSource"
      >
        <el-table-column label="表单名称" prop="name" align="center" />
        <el-table-column label="表单大类" prop="name" align="center" />
        <el-table-column label="统计时间类型" prop="name" align="center" />
        <el-table-column label="表单类型" prop="name" align="center" />
        <el-table-column label="是否必填" prop="name" align="center" />
        <el-table-column
          label="启用"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column label="前置表单" prop="name" align="center" />
        <el-table-column label="操作" prop="name" align="center">
          <template slot-scope="scope">
            <a href="javascript:;">表单详情</a>
            <el-divider direction="vertical" />
            <a href="javascript:;">表单属性</a>
            <el-divider direction="vertical" />
            <a href="javascript:;">复制</a>
            <el-divider direction="vertical" />
            <el-popconfirm title="确认删除该表单吗？">
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
    </el-card>
    <add-form-drawer ref="addFormDrawer" />
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import Pagination from "components/Pagination";
import AddFormDrawer from "./components/add-form-drawer";
export default {
  name: "FormDetail",
  components: { PageHeaderLayout, Pagination, AddFormDrawer },
  data() {
    return {
      collectionDetail: {},
      loading: false,
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
    };
  },
  created() {
    this.collectionDetail = this.$route.params;
  },
  methods: {
    loadData() {},

    addForm() {
      this.$refs.addFormDrawer.show(this.collectionDetail);
    },
  },
};
</script>
 
<style>
</style>