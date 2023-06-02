<template>
  <div>
    <page-header-layout>
      <el-card shadow="always" style="margin-bottom: 8px">
        <!-- Query Start -->
        <el-row class="search-row" style="margin-bottom: 0px">
          <el-col :span="22">
            <div class="filter-container">
              <el-form
                label-width="70px"
                size="small"
                :inline="true"
                @keyup.enter.native="searchQuery"
              >
                <el-form-item label="任务名称">
                  <el-select v-model="queryParam.name" placeholder="请选择">
                    <el-option
                      label="2022年状态数据填报"
                      value="2022年状态数据填报"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="表单大类">
                  <el-select v-model="queryParam.type" placeholder="请选择">
                    <el-option label="全部" value="全部" />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-select v-model="queryParam.type" placeholder="请选择">
                    <el-option label="全部" value="全部" />
                  </el-select>
                </el-form-item>
                <el-form-item label="表单名称">
                  <el-input
                    v-model="queryParam.formName"
                    placeholder="请输入表单名称"
                  />
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
            </div>
          </el-col>
          <el-col :span="2">
            <div class="search-button-admin">
              <el-button type="primary" size="small">一键催办</el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="always">
        <el-tabs v-model="activeName">
          <el-tab-pane label="全部" name="first">
            <el-table
              v-loading="loading"
              :data="firstDataSource"
              size="small"
              :border="true"
            >
              <el-table-column label="表单名称" prop="account" align="center" />
              <el-table-column label="类型" prop="name" align="center" />
              <el-table-column label="负责部门" prop="orgName" align="center" />
              <el-table-column label="协作部门" prop="email" align="center" />
              <el-table-column label="填报人" prop="email" align="center" />
              <el-table-column label="审核人" prop="email" align="center" />
              <el-table-column label="状态" prop="email" align="center" />
              <el-table-column
                label="统计截止时间"
                prop="email"
                align="center"
              />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <a href="javascript:;">配置人员</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">查看</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">审核</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">催办</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">填报进度</a>
                </template>
              </el-table-column>
            </el-table>
            <pagination :pagination="ipagination" @change="loadData" />
          </el-tab-pane>
          <el-tab-pane label="我填报的" name="second"
            ><el-table
              v-loading="loading"
              :data="firstDataSource"
              size="small"
              :border="true"
            >
              <el-table-column label="表单名称" prop="account" align="center" />
              <el-table-column label="负责部门" prop="orgName" align="center" />
              <el-table-column label="审核人" prop="email" align="center" />
              <el-table-column label="状态" prop="email" align="center" />
              <el-table-column
                label="统计截止时间"
                prop="email"
                align="center"
              />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <a href="javascript:;">配置人员</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">查看</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">审核</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">催办</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">填报进度</a>
                </template>
              </el-table-column>
            </el-table>
            <pagination :pagination="ipagination" @change="loadData" />
          </el-tab-pane>
          <el-tab-pane label="我审核的" name="third"
            ><el-table
              v-loading="loading"
              :data="firstDataSource"
              size="small"
              :border="true"
            >
              <el-table-column label="表单名称" prop="account" align="center" />
              <el-table-column label="类型" prop="name" align="center" />
              <el-table-column label="负责部门" prop="orgName" align="center" />
              <el-table-column label="协作部门" prop="email" align="center" />
              <el-table-column label="填报人" prop="email" align="center" />
              <el-table-column label="状态" prop="email" align="center" />
              <el-table-column
                label="统计截止时间"
                prop="email"
                align="center"
              />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <a href="javascript:;">配置人员</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">查看</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">审核</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">催办</a>
                  <el-divider direction="vertical" />
                  <a href="javascript:;">填报进度</a>
                </template>
              </el-table-column>
            </el-table>
            <pagination :pagination="ipagination" @change="loadData" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </page-header-layout>
  </div>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import Pagination from "components/Pagination";
export default {
  name: "TaskDetail",
  components: { PageHeaderLayout, Pagination },
  data() {
    return {
      queryParam: {},
      activeName: "first",
      firstDataSource: [],
      loading: false,
      //分页参数
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
    };
  },
  methods: {
    searchQuery() {},

    loadData(arg) {},
  },
};
</script>

<style>
</style>