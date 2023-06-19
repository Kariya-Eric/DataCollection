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
      <add-task-step-first v-if="currentStep === 0" ref="firstStep" />
      <add-task-step-second v-if="currentStep === 1" />
      <add-task-step-third v-if="currentStep === 2" />
      <add-task-step-fourth v-if="currentStep === 3" />
    </div>
    <div class="footer">
      <el-button
        type="primary"
        icon="el-icon-arrow-left"
        :disabled="currentStep === 0"
        size="small"
        @click="backStep"
        >上一步</el-button
      >
      <el-button
        type="primary"
        :disabled="currentStep === 3"
        @click="frontStep"
        size="small"
        >下一步<i class="el-icon-arrow-right el-icon--right"></i
      ></el-button>
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
      this.currentStep = 0;
      this.visible = false;
    },

    backStep() {
      this.currentStep--;
    },

    async frontStep() {
      if (this.currentStep === 0) {
        let ret = await this.$refs.firstStep.validateRules();
        if (ret) {
          this.currentStep++;
        }
      }
      //this.currentStep++;
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
.footer {
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 32px;
  }
}
</style>