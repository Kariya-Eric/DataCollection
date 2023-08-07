<template>
  <el-dialog
    fullscreen
    :visible="visible"
    :title="taskId ? '修改任务' : '添加任务'"
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
        v-if="currentStep === 0"
        @initTask="initTask"
        @back="close"
        @change="changeStep"
        :taskId="taskId"
      />
      <add-task-step-second
        v-if="currentStep === 1"
        @change="changeStep"
        :taskId="taskId"
        @back="close"
      />
      <add-task-step-third
        v-if="currentStep === 2"
        @change="changeStep"
        :taskId="taskId"
        @back="close"
      />
      <add-task-step-fourth
        v-if="currentStep === 3"
        @back="close"
        :taskId="taskId"
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
  data() {
    return {
      visible: false,
      currentStep: 0,
      taskId: undefined,
    };
  },
  methods: {
    show(taskId) {
      this.currentStep = 0;
      this.taskId = taskId;
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.taskId = undefined;
      this.$emit("refresh");
    },
    changeStep(step) {
      this.currentStep = step;
    },
    initTask(taskId) {
      this.taskId = taskId;
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
