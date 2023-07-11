<template>
  <el-card class="box-card">
    <div class="svg-container">
      <svg-icon width="30px" height="30px" icon-class="数据采集" />
      <span>数据采集</span>
    </div>
    <div class="labelSvg" v-if="task.showLabel">
      <svg-icon
        width="78px"
        height="78px"
        :icon-class="task.showLabel == 1 ? '即将截止' : '已逾期'"
      />
    </div>
    <div class="label">
      <ul>
        <li>任务名称：&nbsp;&nbsp;{{ task.name }}</li>
        <li>开始时间：&nbsp;&nbsp;{{ task.startTime }}</li>
        <li>截止时间：&nbsp;&nbsp;{{ task.endTime }}</li>
      </ul>
    </div>
    <div style="text-align: right">
      <el-button type="primary" size="small">进入任务</el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "DataCard",
  props: ["task"],
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.box-card {
  background: #ffffff;
  border-radius: 8px;
}
.svg-container {
  display: table;
  height: 30px;
  border-spacing: 10px;
  span {
    display: table-cell;
    vertical-align: middle;
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
  }
}
.label {
  color: #4a4c51;
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  ul {
    list-style: none;
    padding-left: 10px;
    margin-left: 0;
    li {
      padding-bottom: 10px;
    }
  }
}
.el-button--primary {
  width: 90px;
  height: 32px;
  background: #2f68bd;
  border-color: #2f68bd;
}
.box-card {
  position: relative;
}
.labelSvg {
  position: absolute;
  right: 0;
  top: 0;
  width: 78px;
  height: 78px;
}
</style>
