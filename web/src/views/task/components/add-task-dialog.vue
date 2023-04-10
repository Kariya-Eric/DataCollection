<template>
  <el-dialog title="添加任务" :visible="visible" fullscreen @close="close">
    <div class="steps">
      <el-steps
        :active="currentStep"
        align-center
        finish-status="success"
        process-status="finish"
      >
        <el-step title="基础信息" @click.native="changeStep(0)" />
        <el-step title="表单配置" @click.native="changeStep(1)" />
        <el-step title="权限配置" @click.native="changeStep(2)" />
        <el-step title="任务配置完成" @click.native="changeStep(3)" />
      </el-steps>
    </div>
    <div class="main-form">
      <add-task-step-first v-if="currentStep === 0" />
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
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },

    changeStep(step) {
      this.currentStep = step;
    },
  },
};
</script>

<style lang="scss" scoped>
.steps{
  width: 80%;
  margin: auto;
  margin-bottom: 36px;
}
.main-form {
  width: 60%;
  margin: auto;
}
</style>