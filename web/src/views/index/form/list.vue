<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-row class="search-row">
        <el-col :span="20">
          <div class="filter-container">
            <el-form label-width="80px" size="small" :inline="true">
              <el-form-item label="合集名称">
                <el-input
                  v-model="queryParam.name"
                  placeholder="请输入合集名称"
                  @input="searchQuery"
                />
              </el-form-item>
              <el-form-item label="合集类型">
                <el-select
                  v-model="queryParam.type"
                  placeholder="请选择合集类型"
                  clearable
                  @change="searchQuery"
                >
                  <el-option
                    label="教学基本状态数据"
                    value="教学基本状态数据"
                  />
                  <el-option label="其他数据" value="其他数据" />
                </el-select>
              </el-form-item>
              <el-form-item label="年份">
                <el-input
                  v-model="queryParam.y"
                  placeholder="请输入合集名称"
                  @input="searchQuery"
                />
              </el-form-item>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-search"
                @click="searchQuery"
                >搜索</el-button
              >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-refresh-right"
                @click="searchReset"
                >重置</el-button
              >
            </el-form>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="search-button-admin">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addCollection"
              >新建合集</el-button
            >
          </div>
        </el-col>
      </el-row>
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
        <el-table-column label="启用" prop="enabled" align="center" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showCollectionDetail(scope.row)"
              >合集详情</a
            >
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="updateCollection(scope.row)"
              >合集属性</a
            >
            <el-divider direction="vertical" />
            <el-popconfirm
              @confirm="delCollection(scope.row)"
              title="确认删除该合集吗？"
            >
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
      <!-- Table End -->
    </el-card>
    <add-collection-dialog ref="addCollectionDialog" @refresh="loadData" />
  </div>
</template>
<script>
import Pagination from "components/Pagination";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import AddCollectionDialog from "./components/add-collection-dialog";
import { delFormCollection } from "@/api/form";
export default {
  name: "FormList",
  mixins: [DataCollectionMixin],
  components: { Pagination, AddCollectionDialog },
  data() {
    return {
      url: {
        list: "/uc/api/formCollection/list",
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

    delCollection(row) {
      let param = "id=" + row.id;
      this.loading = true;
      delFormCollection(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    showCollectionDetail(row) {
      const { id, name, type, year } = row;
      this.$router.push({ path: `/form/detail/${id}/${name}/${type}/${year}` });
    },
  },
};
</script>

<style></style>
