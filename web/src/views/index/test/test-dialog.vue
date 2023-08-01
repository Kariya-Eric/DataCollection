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
          <Mbutton type="danger" name="清空" />
          <Mbutton type="primary" @click="view" name="预览" />
          <Mbutton type="primary" name="保存" />
          <Mbutton name="返回" icon="返回" @click="close" />
        </div>
      </div>
      <form-generator :formInfo="info" :drawingList="drawingList" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TestDialog",
  data() {
    return {
      visible: false,
      info: {
        type: "固定表单",
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
      console.log(this.drawingList);
    },
  },
};
</script>

<style scoped lang="scss"></style>
