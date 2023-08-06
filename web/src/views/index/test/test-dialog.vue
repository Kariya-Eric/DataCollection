<template>
  <div>
    <el-dialog
      :visible="visible"
      :show-close="false"
      fullscreen
      :append-to-body="true"
    >
      <div slot="title" class="titleSlot">
        <span>测试</span>
        <div class="titleButton">
          <Mbutton type="danger" @click="empty" name="清空" />
          <Mbutton type="primary" @click="view" name="预览" />
          <Mbutton type="primary" name="保存" />
          <Mbutton name="返回" icon="返回" @click="close" />
        </div>
      </div>
      <form-generator
        :formInfo="info"
        :drawingList="drawingList"
        ref="formGenerator"
        @view="showView"
      />
    </el-dialog>
    <test-drawer ref="testDrawer" />
  </div>
</template>

<script>
import TestDrawer from "./test-drawer";
export default {
  name: "TestDialog",
  components: { TestDrawer },
  data() {
    return {
      visible: false,
      info: {
        type: "浮动表单",
      },
      drawingList: [],
    };
  },

  methods: {
    close() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },

    view() {
      this.$refs.formGenerator.view();
    },

    showView(formData) {
      this.$refs.testDrawer.show(formData);
    },

    empty() {
      this.drawingList = [];
    },
  },
};
</script>

<style scoped lang="scss"></style>
