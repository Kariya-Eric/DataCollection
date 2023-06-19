<template>
  <el-dialog
    title="添加任务"
    :visible="visible"
    fullscreen
    @close="close"
    style="overflow: hidden"
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
      <add-task-step-first v-if="currentStep === 0" @init="initTask" />
      <add-task-step-second v-if="currentStep === 1" />
      <add-task-step-third v-if="currentStep === 2" />
      <add-task-step-fourth v-if="currentStep === 3" />
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
    show() {
      this.visible = true;
    },
    close() {
      this.currentStep = 0;
      this.visible = false;
    },

    initTask(taskId, flag) {
      this.taskId = taskId;
      if (flag) {
        this.changeStep(1);
      }
    },

    changeStep(step) {
      this.currentStep = step;
    },
  },
};
</script>

<style lang="scss" scoped>
.steps {
  width: 70%;
  margin: auto;
  margin-bottom: 36px;
}
</style>
