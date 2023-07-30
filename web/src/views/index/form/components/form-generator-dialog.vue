<template>
  <el-dialog
    v-if="visible"
    :visible="visible"
    fullscreen
    :show-close="false"
    :append-to-body="true"
  >
    <div slot="title" class="titleSlot">
      <span
        ><el-tag type="warning" style="margin-right: 24px">{{
          info.type
        }}</el-tag>
        {{ info.name }}（{{ info.collectTimeType }}）</span
      >
      <div style="display: inline-block; margin-left: 30%">
        <Mbutton
          type="text"
          name="表单设计"
          @click="() => (this.activeTab = 0)"
          :class="{ active: activeTab == 0, inactive: activeTab == 1 }"
        />
        <Mbutton
          type="text"
          name="校验规则"
          @click="() => (this.activeTab = 1)"
          :class="{ active: activeTab == 1, inactive: activeTab == 0 }"
        />
      </div>
      <div class="titleButton">
        <Mbutton type="danger" name="清空" />
        <Mbutton type="primary" name="预览" />
        <Mbutton type="primary" name="保存" />
        <Mbutton name="返回" icon="返回" @click="close" />
      </div>
    </div>

    <div v-if="activeTab === 0">
      <form-generator :formInfo="info" />
    </div>
    <div class="container" v-else></div>
  </el-dialog>
</template>

<script>
export default {
  name: "FormGeneartorDialog",

  data() {
    return {
      visible: false,
      info: {},
      activeTab: 0,
      drawerVisible: false,
    };
  },
  methods: {
    show(formInfo) {
      this.info = formInfo;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.active {
  font-size: 18px;
  padding-bottom: 32px;
  border-bottom: 6px solid;
}
.inactive {
  font-size: 18px;
  color: #4a4c51;
}
::v-deep .el-dialog__body {
  padding: 8px;
}
::v-deep .el-dialog__header {
  height: 52px;
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
}
</style>
