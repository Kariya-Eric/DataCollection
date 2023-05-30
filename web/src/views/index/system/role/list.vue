<template>
  <page-header-layout title="角色列表">
    <el-row :gutter="24">
      <el-col :span="leftCol">
        <el-card shadow="always" class="app-card">
          <!-- Query Start -->
          <div class="filter-container">
            <el-form label-width="80px" size="small" :inline="true">
              <el-form-item label="角色名称">
                <el-input
                  v-model="queryParam.name"
                  placeholder="请输入角色名称"
                  @keyup.enter.native="searchQuery"
                />
              </el-form-item>
              <el-form-item label="角色状态">
                <el-select
                  v-model="queryParam.status"
                  clearable
                  style="width: 100%"
                  placeholder="请选择"
                >
                  <!-- TODO -->
                </el-select>
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
            <div class="search-button-admin">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="addRole"
                >添加角色</el-button
              >
            </div>
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
      <el-col :span="rightCol">
        <el-card shadow="always" class="app-card">
          <div style="text-align: right">
            <i class="el-icon-circle-close" @click="closeRightCol"></i>
          </div>
          <div class="filter-container">
            <el-form label-width="80px" size="small" :inline="true">
              <el-form-item label="用户账号">
                <el-input placeholder="请输入账号查询" clearable />
              </el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search"
                >搜索</el-button
              >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-refresh-right"
                >重置</el-button
              >
            </el-form>
            <div class="search-button-admin">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="addUser"
              >
                添加用户</el-button
              >
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="addExistUser"
                >已有用户</el-button
              >
            </div>
          </div>
          <el-table
            v-loading="userloading"
            :data="userData"
            size="small"
            :border="true"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="帐号" prop="account" align="center" />
            <el-table-column label="姓名" prop="name" align="center" />
            <el-table-column label="状态" prop="status" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <a href="javascript:;">编辑</a>
                <el-divider direction="vertical" />
                <a href="javascript:;">移除用户</a>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pagination="userPagination" @change="loadUserData" />
        </el-card>
      </el-col>
    </el-row>
    <role-dialog ref="roleDialog" @refresh="loadData" />
    <user-drawer ref="userDrawer" />
    <exist-user-dialog ref="existUserDialog" />
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import Pagination from "components/Pagination";
import RoleDialog from "./components/role-dialog";
import UserDrawer from "../user/components/user-drawer";
import ExistUserDialog from "./components/exist-user-dialog";
export default {
  name: "RoleList",
  mixins: [DataCollectionMixin],
  components: {
    PageHeaderLayout,
    Pagination,
    RoleDialog,
    UserDrawer,
    ExistUserDialog,
  },
  data() {
    return {
      url: {
        list: "/uc/api/role/getRolePage",
      },
      selectedKey: "",
      userloading: false,
      userData: [],
      userPagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
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
      this.userloading = true;
    },

    closeRightCol() {
      this.selectedKey = "";
    },

    addUser() {
      this.$refs.userDrawer.show(true);
    },

    addExistUser() {
      this.$refs.existUserDialog.show(true);
    },

    loadUserData() {},
  },
};
</script>

<style scoped lang="scss"></style>
