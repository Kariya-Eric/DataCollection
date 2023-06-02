<template>
  <page-header-layout title="任务列表">
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-row class="search-row">
        <el-col :span="12">
          <div class="filter-container">
            <el-form
              label-width="50px"
              size="small"
              :inline="true"
              label-position="left"
            >
              <el-form-item label="部门">
                <el-select
                  v-model="queryParam.orgId"
                  clearable
                  style="width: 100%"
                  placeholder="请选择部门"
                >
                  <!-- TODO -->
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="queryParam.queryWord"
                  placeholder="请输入姓名,帐号,手机"
                  @keyup.enter.native="searchQuery"
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
        <el-col :span="12">
          <div class="search-button-admin">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addUser"
              >添加用户</el-button
            >
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              v-if="selectedRowKeys.length > 0"
              @click="delBatch"
              >批量删除</el-button
            >
            <el-button type="primary" size="small" icon="el-icon-upload2"
              >导入</el-button
            >
            <el-button type="primary" size="small" icon="el-icon-download"
              >导出</el-button
            >
            <a>下载导入模板</a>
          </div>
        </el-col>
      </el-row>

      <!-- Query End -->

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        size="small"
        :border="true"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="帐号" prop="account" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="所属部门" prop="orgName" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="手机号" prop="mobile" align="center" />
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
            <a href="javascript:;" @click="showUser(scope.row)">查看</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="updateUser(scope.row)">编辑</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="resetPwd(scope.row)">重置密码</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
    </el-card>
    <user-drawer ref="userDrawer" @refresh="loadData" />
    <reset-password-dialog ref="resetPasswordDialog" />
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import UserDrawer from "./components/user-drawer";
import Pagination from "components/Pagination";
import ResetPasswordDialog from "./components/reset-password-dialog";
import { delUserBatch } from "@/api/system";
export default {
  name: "UserList",
  mixins: [DataCollectionMixin],
  components: { PageHeaderLayout, Pagination, UserDrawer, ResetPasswordDialog },
  data() {
    return {
      url: {
        list: "/uc/api/user/getUserPage",
      },
    };
  },
  methods: {
    addUser() {
      this.$refs.userDrawer.show(true);
    },
    showUser(info) {
      this.$refs.userDrawer.show(false, false, info);
    },
    updateUser(info) {
      this.$refs.userDrawer.show(false, true, info);
    },

    resetPwd(info) {
      this.$refs.resetPasswordDialog.show(info);
    },

    delBatch() {
      let ids = "";
      this.selectedRowKeys.forEach((element) => {
        ids += element.id + ",";
      });
      ids = "ids=" + ids.substring(0, ids.length - 1);
      this.loading = true;
      delUserBatch(ids)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = true;
          this.loadData();
        });
    },
  },
};
</script>

<style scoped lang="scss"></style>
