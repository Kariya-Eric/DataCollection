<template>
  <el-card shadow="always" class="app-card">
    <div class="mainContent">
      <el-descriptions title="基础信息" :column="4">
        <template slot="extra">
          <el-button
            type="primary"
            size="small"
            v-if="!editFlag"
            @click="editTask"
            >编辑</el-button
          >
          <el-button type="primary" size="small" v-else @click="saveTask"
            >保存</el-button
          >
          <el-button type="primary" size="small">导出</el-button>
          <el-button size="small" @click="goBack">返回</el-button>
        </template>
        <el-descriptions-item label="任务名称"
          ><span v-if="!editFlag">{{ taskInfo.name }}</span>
          <el-input
            v-else
            v-model="taskInfo.name"
            size="small"
            style="width: 80%"
          ></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="任务类型"
          ><span v-if="!editFlag">{{ taskInfo.type }}</span>
          <el-select
            v-else
            v-model="taskInfo.type"
            size="small"
            style="width: 80%"
          ></el-select
        ></el-descriptions-item>
        <el-descriptions-item label="统计开始时间"
          ><span v-if="!editFlag">{{ taskInfo.statisticsStartTime }}</span>
          <el-date-picker
            v-else
            v-model="taskInfo.statisticsStartTime"
            size="small"
            style="width: 80%"
          />
        </el-descriptions-item>
        <el-descriptions-item label="统计截止时间">
          <span v-if="!editFlag">{{ taskInfo.statisticsEndTime }}</span>
          <el-date-picker
            v-else
            v-model="taskInfo.statisticsEndTime"
            size="small"
            style="width: 80%"
          />
        </el-descriptions-item>
        <el-descriptions-item label="学年">
          <span v-if="!editFlag">{{ taskInfo.schoolYear }}</span>
          <el-select
            v-else
            v-model="taskInfo.schoolYear"
            size="small"
            style="width: 80%"
          ></el-select>
        </el-descriptions-item>
        <el-descriptions-item label="自然年">
          <span v-if="!editFlag">{{ taskInfo.year }}</span>
          <el-select
            v-else
            v-model="taskInfo.year"
            size="small"
            style="width: 80%"
          ></el-select>
        </el-descriptions-item>
        <el-descriptions-item label="学校专业类别"></el-descriptions-item>
        <el-descriptions-item label="任务状态">
          <div v-if="!editFlag">
            <el-tag v-if="taskInfo.status === 0" type="info" size="small"
              >未启用</el-tag
            >
            <el-tag v-if="taskInfo.status === 1" size="small">启用中</el-tag>
            <el-tag v-if="taskInfo.status === 2" type="success" size="small"
              >完成</el-tag
            >
            <el-tag v-if="taskInfo.status === 3" type="danger" size="small"
              >停用</el-tag
            >
          </div>
          <el-select
            v-else
            v-model="taskInfo.status"
            size="small"
            style="width: 80%"
          ></el-select>
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
        <el-table-column label="表单名称" align="center" />
        <el-table-column label="负责部门" align="center" />
        <el-table-column label="协作部门" align="center" />
        <el-table-column label="统计截止日期" align="center" />
      </el-table>
    </div>
    <add-task-dialog ref="addTaskDialog" />
  </el-card>
</template>

<script>
import addTaskDialog from "./components/add-task.dialog";
export default {
  components: { addTaskDialog },
  name: "TaskInfo",
  data() {
    return {
      taskInfo: {},
      editFlag: false,
      formList: [],
      loading: false,
    };
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "taskInfo") {
          this.taskInfo = JSON.parse(newRoute.query.taskInfo);
        }
      },
      immediate: true,
    },
  },

  methods: {
    goBack() {
      this.$router.back(-1);
    },

    editTask() {
      this.$refs.addTaskDialog.show(this.taskInfo.id);
      //this.editFlag = true;
    },

    saveTask() {
      this.editFlag = false;
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
</style>
