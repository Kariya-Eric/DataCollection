<template>
  <div>
    <el-card shadow="always" style="margin-bottom: 8px">
      <!-- Query Start -->
      <el-row class="search-row" style="margin-bottom: 0px">
        <el-col :span="22">
          <div class="filter-container">
            <el-form label-width="70px" size="small" :inline="true">
              <el-form-item label="任务名称">
                <el-select
                  v-model="queryParam.name"
                  placeholder="请选择"
                  @change="searchQuery"
                >
                  <el-option
                    label="2022年状态数据填报"
                    value="2022年状态数据填报"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="表单大类">
                <el-select
                  v-model="queryParam.type"
                  placeholder="请选择"
                  @change="searchQuery"
                >
                  <el-option label="全部" value="全部" />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  v-model="queryParam.type"
                  placeholder="请选择"
                  @change="searchQuery"
                >
                  <el-option label="全部" value="全部" />
                </el-select>
              </el-form-item>
              <el-form-item label="表单名称">
                <el-input
                  v-model="queryParam.formName"
                  placeholder="请输入表单名称"
                  @input="searchQuery"
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
      <el-tabs v-model="activeName" @tab-click="getTaskDetail">
        <el-tab-pane
          :label="item.name"
          :name="item.type"
          v-for="item in typeList"
          :key="item.type"
        >
          <el-table
            v-loading="loading"
            :data="taskFormDataSource"
            size="small"
            row-key="id"
            default-expand-all
            :border="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          >
            <el-table-column label="表单名称" prop="formName" align="center" />
            <el-table-column
              label="类型"
              prop="type"
              align="center"
              width="100"
            />
            <el-table-column
              label="负责部门"
              prop="responsibleOrgName"
              align="center"
            />
            <el-table-column
              label="协作部门"
              prop="collaborateOrgName"
              align="center"
            />
            <el-table-column
              label="填报人"
              prop="email"
              align="center"
              width="120"
            />
            <el-table-column
              label="审核人"
              prop="email"
              align="center"
              width="120"
            />
            <el-table-column
              label="状态"
              prop="email"
              align="center"
              width="120"
            />
            <el-table-column
              label="统计截止时间"
              prop="statisticsEndTime"
              align="center"
              width="120"
            />
            <el-table-column label="操作" align="center" width="320">
              <template slot-scope="scope">
                <a href="javascript:;">配置人员</a>
                <el-divider direction="vertical" />
                <a href="javascript:;" @click="showForm(scope.row)">查看</a>
                <el-divider direction="vertical" />
                <a href="javascript:;">审核</a>
                <el-divider direction="vertical" />
                <a href="javascript:;">催办</a>
                <el-divider direction="vertical" />
                <a href="javascript:;">填报进度</a>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination :pagination="ipagination" @change="loadData" /> -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <form-drawer ref="formDrawer" />
  </div>
</template>

<script>
import { getTaskFormDetail, taskFormDetail } from "@/api/task";
import FormDrawer from "./components/fom-drawer";
import Pagination from "components/Pagination";
export default {
  name: "TaskDetail",
  components: { Pagination, FormDrawer },
  data() {
    return {
      typeList: [
        { type: "ALL", name: "全部" },
        { type: "FILL", name: "我填报的" },
        { type: "APPROVE", name: "我审核的" },
      ],
      activeName: "ALL",
      taskId: "",
      queryParam: {},
      taskFormDataSource: [],
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

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "taskDetail") {
          this.taskId = newRoute.query.taskId;
          this.getTaskDetail();
        }
      },
      immediate: true,
    },
  },

  methods: {
    searchQuery() {},

    getTaskDetail() {
      let params = { taskId: this.taskId, type: this.activeName };
      this.loading = true;
      getTaskFormDetail(params)
        .then((res) => {
          if (res.state) {
            this.taskFormDataSource = this.handlerData(res.value);
          }
        })
        .finally(() => (this.loading = false));
    },

    showForm(row) {
      let id = row.id.indexOf("parent") > -1 ? row.id.substring(7) : row.id;
      taskFormDetail(id).then((res) => {
        if (res.state) {
          const formProperties = JSON.parse(res.value.formProperties);
          const componentProperties = JSON.parse(res.value.componentProperties);
          let formData = { ...formProperties, fields: componentProperties };
          this.$refs.formDrawer.show(formData, formProperties, res.value);
        }
      });
    },

    handlerData(datasource) {
      return datasource.map((ele) => {
        if (ele.children.length !== 0) {
          ele.id = "parent_" + ele.id;
          ele.type = "总表";
          ele.children.forEach((item) => {
            item.type = "子表";
          });
        } else {
          ele.type = "-";
        }
        return ele;
      });
    },
  },
};
</script>

<style></style>
