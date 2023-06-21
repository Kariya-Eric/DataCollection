<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-row class="search-row">
        <el-col :span="16">
          <div class="filter-container">
            <el-form label-width="70px" size="small" :inline="true">
              <el-form-item label="任务类型">
                <el-select
                  v-model="queryParam.type"
                  clearable
                  style="width: 100%"
                  @change="searchQuery"
                  placeholder="请选择任务类型"
                >
                  <el-option
                    label="教学基本状态数据"
                    value="教学基本状态数据"
                  />
                  <el-option label="其他数据" value="其他数据" />
                </el-select>
              </el-form-item>
              <el-form-item label="学年">
                <el-select
                  v-model="queryParam.schoolYear"
                  style="width: 100%"
                  clearable
                  @change="searchQuery"
                  placeholder="请选择学年"
                >
                  <el-option
                    v-for="(opt, index) in schoolYearList"
                    :label="opt"
                    :key="index"
                    :value="opt"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="任务名称">
                <el-input
                  v-model="queryParam.name"
                  placeholder="请输入任务名称"
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
        <el-col :span="8">
          <div class="search-button-admin">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addTask"
              >添加任务</el-button
            >
            <el-button type="primary" size="small" icon="el-icon-upload2"
              >导入</el-button
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
      >
        <el-table-column
          label="任务类型"
          prop="type"
          align="center"
          fixed
          width="150"
        />
        <el-table-column
          label="任务名称"
          prop="name"
          align="center"
          fixed
          width="220"
        />
        <el-table-column
          label="统计开始时间"
          prop="statisticsStartTime"
          align="center"
          sortable
        />
        <el-table-column
          label="统计截止时间"
          prop="statisticsEndTime"
          align="center"
          sortable
        />
        <el-table-column
          label="学年"
          prop="schoolYear"
          align="center"
          width="120"
        />
        <el-table-column label="自然年" prop="year" align="center" width="80" />
        <el-table-column
          label="任务状态"
          prop="status"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="info">未启用</el-tag>
            <el-tag v-if="scope.row.status === 1">启用中</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">完成</el-tag>
            <el-tag v-if="scope.row.status === 3" type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="完成进度" prop="percentage" align="center">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.percentage" />
          </template>
        </el-table-column>
        <el-table-column
          label="启用"
          prop="enabledFlag"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-switch
              disabled
              v-model="scope.row.enabledFlag"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="320">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showTaskInfo(scope.row)">任务概览</a>
            <el-divider direction="vertical" />
            <a
              href="javascript:;"
              v-if="scope.row.enabled !== 0"
              @click="showTaskDetail(scope.row)"
              >任务详情</a
            >
            <el-divider direction="vertical" v-if="scope.row.enabled !== 0" />
            <a href="javascript:;">删除</a>
            <el-divider direction="vertical" />
            <el-dropdown @command="handleCommand" trigger="click">
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">指南下载</el-dropdown-item>
                <el-dropdown-item command="b">模板下载</el-dropdown-item>
                <el-dropdown-item command="c">预览报告</el-dropdown-item>
                <el-dropdown-item command="d">导出报告</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- Table End -->
      <pagination :pagination="ipagination" @change="loadData" />
      <add-task-dialog ref="addTaskDialog" @refresh="loadData" />
    </el-card>
  </div>
</template>

<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import Pagination from "components/Pagination";
import AddTaskDialog from "./components/add-task.dialog.vue";
export default {
  name: "TaskList",
  mixins: [DataCollectionMixin],
  components: { Pagination, AddTaskDialog },
  data() {
    return {
      url: {
        list: "/uc/api/task/list",
      },
    };
  },
  computed: {
    schoolYearList() {
      let startYear = 2018;
      let nowYear = new Date().getFullYear();
      let yearList = [];
      for (let i = startYear; i < nowYear; i++) {
        let option = `${i}-${i + 1}`;
        yearList.push(option);
      }
      return yearList;
    },
  },
  methods: {
    addTask() {
      this.$refs.addTaskDialog.show();
    },

    showTaskInfo(row) {
      this.$router.push({
        path: "/task/info",
        query: { taskId: row.id },
      });
    },

    showTaskDetail(row) {
      this.$router.push({
        path: "/task/detail",
        query: { taskDetail: JSON.stringify(row) },
      });
    },
    handleCommand(command) {},
  },
};
</script>

<style scoped lang="scss">
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
  font-size: 12px;
}
.el-icon-arrow-down {
  font-size: 8px;
}
</style>
