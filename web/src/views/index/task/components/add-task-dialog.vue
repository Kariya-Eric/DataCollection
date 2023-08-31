<template>
  <el-dialog
    fullscreen
    :visible="visible"
    :title="title"
    v-if="visible"
    :append-to-body="true"
    :show-close="false"
  >
    <div class="steps">
      <el-steps
        :active="currentStep"
        align-center
        finish-status="success"
        process-status="finish"
      >
        <el-step title="基础信息" />
        <el-step title="表单配置" />
        <el-step title="权限配置" />
        <el-step title="任务配置完成" />
      </el-steps>
    </div>
    <div>
      <add-task-step-first
        :years="years"
        v-if="currentStep === 0"
        @initTask="initTask"
        @back="close"
        @change="changeStep"
        :task="taskInfo"
      />
      <add-task-step-second
        v-if="currentStep === 1"
        @change="changeStep"
        :task="taskInfo"
        @back="close"
      />
      <add-task-step-third
        v-if="currentStep === 2"
        @change="changeStep"
        :taskId="taskInfo.id"
        @back="close"
      />
      <add-task-step-fourth
        v-if="currentStep === 3"
        @back="showTaskInfo"
        :taskId="taskInfo.id"
      />
    </div>
  </el-dialog>
</template>

<script>
import AddTaskStepFirst from "./add-task-step-first";
import AddTaskStepSecond from "./add-task-step-second";
import AddTaskStepThird from "./add-task-step-third";
import AddTaskStepFourth from "./add-task-step-fourth";
export default {
  name: "AddTaskDialog",
  components: {
    AddTaskStepFirst,
    AddTaskStepSecond,
    AddTaskStepThird,
    AddTaskStepFourth,
  },
  props: ["years"],
  data() {
    return {
      visible: false,
      currentStep: 0,
      title: "",
      name: "任务",
      taskInfo: {},
    };
  },
  methods: {
    add() {
      this.edit({});
    },

    edit(record) {
      this.taskInfo = Object.assign({}, record);
      this.currentStep = 0;
      this.visible = true;
    },

    close() {
      this.taskId = "";
      this.$emit("refresh");
      this.visible = false;
    },
    changeStep(step) {
      this.currentStep = step;
    },
    initTask(taskId) {
      this.taskId = taskId;
    },

    showTaskInfo() {
      this.$router.push({
        path: "/task/info",
        query: { taskId: this.taskId },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.steps {
  width: 70%;
  margin: auto;
  margin-bottom: 36px;
  margin-top: 36px;
}
</style>
