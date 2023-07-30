<template>
  <div>
    <el-dialog
      title="测试"
      :visible="visible"
      @close="close"
      fullscreen
      :append-to-body="true"
    >
      <form-generator :formInfo="info" />
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
    };
  },

  methods: {
    close() {
      this.visible = false;
    },
    show() {
      this.visible = true;
    },
  },
};
</script>

<style scoped lang="scss"></style>
