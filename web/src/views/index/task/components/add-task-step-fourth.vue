<template>
  <div class="main-form">
    <el-result icon="success">
      <template slot="title"> <h1>任务配置完成</h1> </template>
      <template slot="extra">
        <el-card class="box-card">
          <p>任务名称:2022年状态数据填报</p>
          <p>是否启用任务:<el-switch /></p>
        </el-card>
      </template>
    </el-result>
    <div class="footer">
      <el-button @click="back" size="small">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddTaskStepFourth",
  data() {
    return {};
  },
  methods: {
    back() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 380px;
  p {
    margin: 30px 0;
  }
}
.main-form {
  width: 50%;
  margin: auto;
}
.footer {
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
</style>