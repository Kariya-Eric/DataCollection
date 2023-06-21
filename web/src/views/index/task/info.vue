<template>
  <el-card shadow="always" class="app-card">
    <div class="mainContent">
      <el-descriptions title="基础信息" :column="4">
        <template slot="extra">
          <el-button
            type="primary"
            size="small"
            v-if="!taskInfo.enabledFlag"
            @click="editTask"
            >编辑</el-button
          >
          <el-button type="primary" size="small">导出</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </template>
        <el-descriptions-item label="任务名称"
          >{{ taskInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item label="任务类型">{{
          taskInfo.type
        }}</el-descriptions-item>
        <el-descriptions-item label="统计开始时间"
          >{{ taskInfo.statisticsStartTime }}
        </el-descriptions-item>
        <el-descriptions-item label="统计截止时间">
          {{ taskInfo.statisticsEndTime }}
        </el-descriptions-item>
        <el-descriptions-item label="学年">
          {{ taskInfo.schoolYear }}
        </el-descriptions-item>
        <el-descriptions-item label="自然年">
          {{ taskInfo.year }}
        </el-descriptions-item>
        <el-descriptions-item label="学校专业类别">
          <div class="tagDiv">
            <el-tag
              v-for="(item, index) in tagList"
              :key="index"
              size="small"
              >{{ item }}</el-tag
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <div>
            <el-tag v-if="taskInfo.enabledFlag === 0" type="info" size="small"
              >未启用</el-tag
            >
            <el-tag v-if="taskInfo.enabledFlag === 1" size="small"
              >启用中</el-tag
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="任务进度">
          <el-progress
            :percentage="taskInfo.percentage"
            style="
              display: inline-flex;
              width: 20%;
              margin-top: 14px;
              margin-left: 12px;
            "
          />
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="表单分配" style="margin-top: 24px" />
      <el-table
        :data="formList"
        size="small"
        :border="true"
        v-loading="loading"
      >
        <el-table-column label="表单大类" align="center" />
        <el-table-column label="表单名称" align="center" prop="formName" />
        <el-table-column
          label="负责部门"
          align="center"
          prop="responsibleOrgId"
        />
        <el-table-column
          label="协作部门"
          align="center"
          prop="collaborateOrgId"
        />
        <el-table-column
          label="统计截止日期"
          align="center"
          prop="statisticsEndTime"
        />
      </el-table>
    </div>
    <add-task-dialog ref="addTaskDialog" @refresh="getTaskInfo" />
  </el-card>
</template>

<script>
import addTaskDialog from "./components/add-task.dialog";
import { getTaskFormList, getTaskInfo } from "@/api/task";
export default {
  components: { addTaskDialog },
  name: "TaskInfo",
  data() {
    return {
      taskId: undefined,
      taskInfo: {},
      formList: [],
      loading: false,
      tagList: [],
    };
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "taskInfo") {
          this.taskId = newRoute.query.taskId;
          this.getTaskInfo();
        }
      },
      immediate: true,
    },
  },

  methods: {
    goBack() {
      this.$router.back(-1);
    },

    getTaskInfo() {
      getTaskInfo(this.taskId).then((res) => {
        if (res.state) {
          this.taskInfo = res.value;
          if (this.taskInfo.professionalCategory) {
            this.tagList = this.taskInfo.professionalCategory.split(",");
          }
          if (this.taskInfo.formCollectionId) {
            this.getFormList();
          }
        }
      });
    },

    editTask() {
      this.$refs.addTaskDialog.show(this.taskInfo.id);
    },

    getFormList() {
      this.loading = true;
      let query = {
        taskId: this.taskInfo.id,
        formCollectionId: this.taskInfo.formCollectionId,
      };
      getTaskFormList(query)
        .then((res) => {
          if (res.state) {
            this.formList = res.value;
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.mainContent {
  padding: 12px 24px 24px 24px;
}
/deep/ .el-descriptions-item__container {
  .el-descriptions-item__label {
    line-height: 32px;
  }
  .el-descriptions-item__content {
    line-height: 32px;
    .progress {
      margin-top: 14px;
      margin-left: 12px;
    }
  }
}
.tagDiv .el-tag {
  margin-right: 4px;
}
</style>
