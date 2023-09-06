<template>
  <div>
    <span class="cardTitle">任务名称：&nbsp;&nbsp;{{ taskName }}</span>
    <el-card shadow="always" style="margin-top: 16px">
      <el-form
        label-width="70px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="任务名称">
          <el-select
            v-model="queryParam.name"
            placeholder="请选择"
            @change="searchQuery"
          >
            <el-option label="2022年状态数据填报" value="2022年状态数据填报" />
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
        <el-button type="primary" size="small" icon="el-icon-refresh-right"
          >重置</el-button
        >
      </el-form>

      <div class="listHeader">
        <el-button-group class="buttonGroup">
          <mbutton
            :class="{ active: activeName == 'ALL' }"
            name="全部"
            @click="() => (activeName = 'ALL')"
          />
          <mbutton
            :class="{ active: activeName == 'FILL' }"
            name="我填报的"
            @click="() => (activeName = 'FILL')"
          />
          <mbutton
            :class="{ active: activeName == 'APPROVE' }"
            name="我审核的"
            @click="() => (activeName = 'APPROVE')"
          />
        </el-button-group>
        <div class="listHeaderButton">
          <mbutton type="primary" icon="催办" name="一键催办" />
        </div>
      </div>
      <detail-all-table
        v-if="activeName == 'ALL'"
        :dataSource="taskFormDataSource"
        :loading="loading"
        :taskId="taskId"
        @refresh="getTaskDetail"
      />
      <detail-fill-table
        v-if="activeName == 'FILL'"
        :dataSource="taskFormDataSource"
        :loading="loading"
        @refresh="getTaskDetail"
      />
      <detail-approve-table
        v-if="activeName == 'APPROVE'"
        :dataSource="taskFormDataSource"
        :loading="loading"
        :taskId="taskId"
        @refresh="getTaskDetail"
      />
    </el-card>
  </div>
</template>

<script>
import { getTaskFormDetail } from "@/api/task";
import DetailAllTable from "./components/detail-all-table";
import DetailFillTable from "./components/detail-fill-table";
import DetailApproveTable from "./components/detail-approve-table";
export default {
  name: "TaskDetail",
  components: { DetailAllTable, DetailFillTable, DetailApproveTable },
  data() {
    return {
      taskName: "",
      activeName: "ALL",
      taskId: "",
      queryParam: {},
      taskFormDataSource: [],
      loading: false,
    };
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "taskDetail") {
          this.taskId = newRoute.query.taskId;
          this.taskName = newRoute.query.taskName;
          this.getTaskDetail();
        }
      },
      immediate: true,
    },

    activeName() {
      this.getTaskDetail();
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

    showForm(row) {},

    handlerData(datasource) {
      return datasource.map((ele) => {
        if (ele.children.length == 0) {
          ele.name = ele.formName;
          ele.type = "-";
        } else {
          ele.name = ele.formName;
          ele.type = "总表";
          ele.children.forEach((child) => {
            child.responsibleOrgName = "";
            child.type = "子表";
            child.collaborateOrgName = child.orgName;
          });
        }
        return ele;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.buttonGroup {
  .el-button {
    min-width: 92px;
    border: 1px solid #d9d9d9;
  }
}
.active {
  color: #ffffff;
  background: linear-gradient(180deg, #76a8f4 0%, #2f68bd 100%);
}
</style>
