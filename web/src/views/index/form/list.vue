<template>
  <page-header-layout title="任务列表">
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <div class="filter-container">
        <el-form
          label-width="80px"
          size="small"
          :inline="true"
          @keyup.enter.native="searchQuery"
        >
          <el-form-item label="合集名称">
            <el-input
              v-model="queryParam.name"
              placeholder="请输入合集名称"
              @keyup.enter.native="searchQuery"
            />
          </el-form-item>
        </el-form>
        <div class="search-button-admin">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="addCollection"
            >新建合集</el-button
          >
        </div>
      </div>
      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        size="small"
        :border="true"
      >
        <el-table-column label="合集名称" prop="name" align="center" />
        <el-table-column label="合集类型" prop="type" align="center" />
        <el-table-column label="年份" prop="year" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a href="javascript:;">合集类型</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="updateCollection(scope.row)"
              >合集属性</a
            >
            <el-divider direction="vertical" />
            <a href="javascript:;">复制</a>
            <el-divider direction="vertical" />
            <a href="javascript:;">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
      <!-- Table End -->
    </el-card>
    <add-collection-dialog ref="addCollectionDialog" />
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import Pagination from "components/Pagination";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import AddCollectionDialog from "./components/add-collection-dialog";
export default {
  name: "FormList",
  mixins: [DataCollectionMixin],
  components: { PageHeaderLayout, Pagination, AddCollectionDialog },
  data() {
    return {
      url: {
        list: "/uc/api/form/list",
      },
    };
  },
  methods: {
    addCollection() {
      this.$refs.addCollectionDialog.show();
    },

    updateCollection(row) {
      this.$refs.addCollectionDialog.show(row);
    },
  },
};
</script>

<style>
</style>