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
              prop="fillUserName"
              align="center"
              width="120"
            />
            <el-table-column
              label="审核人"
              prop="responsibleUserName"
              align="center"
              width="120"
            />
            <el-table-column
              label="状态"
              prop="status"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 0" type="info" size="small"
                  >待提交</el-tag
                >
                <el-tag v-if="scope.row.status === 1" size="small"
                  >审核中</el-tag
                >
                <el-tag
                  v-if="scope.row.status === 2"
                  type="success"
                  size="small"
                  >审核通过</el-tag
                >
                <el-tag v-if="scope.row.status === 3" type="danger" size="small"
                  >退回修改</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column
              label="统计截止时间"
              prop="statisticsEndTime"
              align="center"
              width="120"
            />
            <el-table-column label="操作" align="center" width="360">
              <template slot-scope="scope">
                <a href="javascript:;" @click="handleConfig(scope.row)"
                  >配置人员</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:;" @click="showForm(scope.row)">查看</a>
                <el-divider direction="vertical" v-if="scope.row.status == 1||scope.row.status == 0" />
                <el-popconfirm
                  @confirm="authForm(scope.row)"
                  @cancel="authFormBack(scope.row)"
                  confirm-button-text="通过"
                  cancel-button-text="驳回"
                  title="如何操作该表？"
                  v-if="scope.row.status == 1||scope.row.status == 0"
                >
                  <a href="javascript:;" slot="reference">审核</a>
                </el-popconfirm>
                <el-divider
                  direction="vertical"
                  v-if="scope.row.status !== 2"
                />
                <a href="javascript:;" v-if="scope.row.status !== 2">催办</a>
                <el-divider direction="vertical" v-if="scope.row.status == 1" />
                <el-popconfirm
                  @confirm="redoForm(scope.row)"
                  title="确认要撤回该表吗"
                  v-if="scope.row.status == 1"
                >
                  <a href="javascript:;" slot="reference">撤回</a>
                </el-popconfirm>
                <el-divider direction="vertical" />
                <a href="javascript:;" @click="showProgress(scope.row)"
                  >填报进度</a
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination :pagination="ipagination" @change="loadData" /> -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <config-user-dialog ref="configUserDialog" @refresh="getTaskDetail" />
    <form-drawer ref="formDrawer" />
    <progress-drawer ref="progressDrawer" />
  </div>
</template>

<script>
import {
  getTaskFormDetail,
  taskFormDetail,
  approveForm,
  recallForm,
} from "@/api/task";
import FormDrawer from "./components/fom-drawer";
import ProgressDrawer from "./components/progress-drawer";
import Pagination from "components/Pagination";
import ConfigUserDialog from "./components/config-user-dialog";
export default {
  name: "TaskDetail",
  components: { Pagination, FormDrawer, ConfigUserDialog, ProgressDrawer },
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
      taskFormDetail(row.id).then((res) => {
        if (res.state) {
          if (res.value.formProperties && res.value.componentProperties) {
            const formProperties = JSON.parse(res.value.formProperties);
            const componentProperties = JSON.parse(
              res.value.componentProperties
            );
            let formData = { ...formProperties, fields: componentProperties };
            this.$refs.formDrawer.show(formData, formProperties, res.value);
          } else {
            this.$message.error("未根据id查询到表单");
          }
        }
      });
    },

    handlerData(datasource) {
      return datasource.map((ele) => {
        if (ele.children.length !== 0) {
          let children = ele.children.slice(1, ele.children.length);
          ele = ele.children[0];
          ele.type = "总表";
          ele.collaborateOrgName = "-";
          ele.children = children.map((child, index) => {
            child.type = "子表";
            child.responsibleOrgName = "-";
            child.collaborateOrgName =
              child.collaborateOrgName.split(",")[index];
            return child;
          });
        } else {
          ele.type = "-";
        }
        return ele;
      });
    },

    handleConfig(row) {
      this.$refs.configUserDialog.show(row, this.taskId);
    },

    authForm(row) {
      this.loading = true;
      let param = { id: row.id, status: 2 };
      approveForm(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    authFormBack(row) {
      this.loading = true;
      let param = { id: row.id, status: 3 };
      approveForm(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    redoForm(row) {
      this.loading = true;
      recallForm(row.id)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getTaskDetail();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    showProgress(row) {
      this.$refs.progressDrawer.show(row);
    },
  },
};
</script>

<style></style>
