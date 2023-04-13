<template>
  <page-header-layout title="角色列表">
    <el-row>
      <el-col :md="leftCol">
        <el-card shadow="always" class="app-card">
          <!-- Query Start -->
          <div class="filter-container">
            <el-row>
              <el-form
                label-width="100px"
                size="small"
                @keyup.enter.native="searchQuery"
              >
                <el-col :span="5">
                  <el-form-item label="角色名称">
                    <el-input
                      v-model="queryParam.name"
                      placeholder="请输入角色名称"
                      @keyup.enter.native="searchQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="角色状态">
                    <el-select
                      v-model="queryParam.status"
                      clearable
                      placeholder="请选择"
                    >
                      <!-- TODO -->
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-form>
              <el-col :span="4">
                <div class="search-button-wrapper">
                  <el-button type="primary" size="small" icon="el-icon-search"
                    >搜索</el-button
                  >
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-refresh-right"
                    >重置</el-button
                  >
                </div>
              </el-col>

              <el-col :span="10">
                <div class="search-button-admin">
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-plus"
                    @click="addRole"
                    >添加角色</el-button
                  >
                </div>
              </el-col>
            </el-row>
          </div>
          <!-- Query End -->

          <!-- Table Start -->
          <el-table
            v-loading="loading"
            :data="dataSource"
            size="small"
            :border="true"
          >
            <el-table-column width="55" align="center">
              <template slot-scope="scope">
                <el-radio :label="scope.row.id" v-model="selectedKey"
                  ><i></i
                ></el-radio>
              </template>
            </el-table-column>
            <el-table-column label="角色名称" prop="name" align="center" />
            <el-table-column label="角色编码" prop="code" align="center" />
            <el-table-column label="状态" prop="enabled" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.enabled"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="更新时间"
              prop="updateTime"
              align="center"
              sortable
            />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a href="javascript:;" @click="showUser(scope.row)">用户</a>
                <el-divider direction="vertical" />
                <a href="javascript:;" @click="updateRole(scope.row)">编辑</a>
                <el-divider direction="vertical" />
                <a href="javascript:;">授权</a>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pagination="ipagination" @change="loadData" />
        </el-card>
      </el-col>
      <el-col :md="rightCol">
        <span>123</span>
      </el-col>
    </el-row>
    <role-dialog ref="roleDialog" />
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import Pagination from "components/Pagination";
import RoleDialog from "./components/role-dialog";
export default {
  name: "RoleList",
  mixins: [DataCollectionMixin],
  components: { PageHeaderLayout, Pagination, RoleDialog },
  data() {
    return {
      url: {
        list: "/uc/api/role/getRolePage",
      },
      selectedKey: "",
    };
  },
  computed: {
    leftCol() {
      return this.selectedKey === "" ? 24 : 12;
    },
    rightCol() {
      return this.selectedKey === "" ? 0 : 12;
    },
  },
  methods: {
    addRole() {
      this.$refs.roleDialog.show(true);
    },

    updateRole(info) {
      this.$refs.roleDialog.show(false, info);
    },

    showUser(info) {
      this.selectedKey = info.id;
    },
  },
};
</script>

<style scoped lang="scss">
.search-button-wrapper {
  margin: 8px 0 0 16px;
}
.search-button-admin {
  margin-top: 8px;
  float: right;
  a {
    margin-left: 12px;
    margin-right: 24px;
  }
}
/deep/ .el-form-item {
  margin-top: 8px;
}
</style>