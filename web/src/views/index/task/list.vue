<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-form
        label-width="70px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="任务类型">
          <el-select
            v-model="queryParam.type"
            clearable
            placeholder="请选择任务类型"
          >
            <el-option label="教学基本状态数据" value="教学基本状态数据" />
            <el-option label="其他数据" value="其他数据" />
          </el-select>
        </el-form-item>
        <el-form-item label="学年">
          <el-select
            v-model="queryParam.schoolYear"
            clearable
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
          <el-input v-model="queryParam.name" placeholder="请输入任务名称" />
        </el-form-item>
        <mbutton type="primary" @click="searchQuery" name="搜索" />
        <mbutton @click="searchReset" name="重置" />
      </el-form>

      <div class="listHeader">
        <span>任务列表</span>
        <div class="listHeaderButton">
          <mbutton name="下载导入模板" />
          <mbutton type="primary" icon="导入" name="导入" />
          <mbutton
            type="primary"
            icon="新建"
            name="添加任务"
            @click="addTask"
          />
        </div>
      </div>

      <!-- Query End -->

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        class="listTable"
        :header-cell-style="headerStyle"
      >
        <el-table-column label="任务类型" prop="type" align="center" />
        <el-table-column label="任务名称" prop="name" align="center" />
        <el-table-column
          label="填报开始时间"
          prop="statisticsStartTime"
          align="center"
          sortable
        />
        <el-table-column
          label="填报截止时间"
          prop="statisticsEndTime"
          align="center"
          sortable
        />
        <el-table-column label="学年" prop="schoolYear" align="center" />
        <el-table-column label="统计时间" prop="year" align="center" />
        <el-table-column label="任务状态" prop="status" align="center">
          <template slot-scope="scope">
            <status :status="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column
          label="完成进度"
          prop="percentage"
          align="center"
          v-if="check('tasklist_progress')"
        >
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.percentage" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="check('tasklist_enable')"
          label="启用"
          prop="enabledFlag"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabledFlag"
              :active-value="1"
              :inactive-value="0"
              @change="(val) => changeEnabledFlag(scope.row, val)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="280">
          <template slot-scope="scope">
            <menu-link @click="showTaskInfo(scope.row)">任务概览</menu-link>
            <menu-link
              @click="showTaskDetail(scope.row)"
              v-if="scope.row.enabled !== 0"
              >任务详情</menu-link
            >
            <el-dropdown
              @command="(command) => handleCommand(command, scope.row)"
              trigger="click"
              :hide-on-click="false"
              placement="bottom"
            >
              <a> 更多<i class="el-icon-arrow-down el-icon--right"></i> </a>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">指南下载</el-dropdown-item>
                <el-dropdown-item command="b">模板下载</el-dropdown-item>
                <el-dropdown-item command="c">预览报告</el-dropdown-item>
                <el-dropdown-item command="d">导出数据</el-dropdown-item>
                <el-popconfirm
                  @confirm="handleCommand('e', scope.row)"
                  title="确认删除任务吗？"
                >
                  <el-dropdown-item slot="reference" style="color: #e23322"
                    >删除任务</el-dropdown-item
                  >
                </el-popconfirm>
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
import AddTaskDialog from "./components/add-task-dialog.vue";
import { enableTask, delTask } from "@/api/task";
export default {
  name: "TaskList",
  mixins: [DataCollectionMixin],
  components: { AddTaskDialog },
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
        query: { taskId: row.id, taskName: row.name },
      });
    },

    handleCommand(command, row) {
      if (command == "e") {
        this.delTask(row);
      }
    },

    changeEnabledFlag(row, val) {
      this.loading = true;
      enableTask({ id: row.id, enabledFlag: val })
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    delTask(row) {
      this.loading = true;
      let param = "id=" + row.id;
      delTask(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.loadData();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped lang="scss"></style>
