<template>
  <el-dialog
    :visible="visible"
    :title="title"
    :width="width"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <div slot="title" class="dialog-title" v-if="!title">
      <slot name="title"></slot>
    </div>
    <el-scrollbar style="height: 50vh">
      <slot> </slot>
    </el-scrollbar>
    <div slot="footer" class="dialog-footer">
      <mbutton @click="handleCancel" :name="cancelText" />
      <mbutton
        type="primary"
        @click="handleConfirm"
        :name="okText"
        :loading="loading"
      />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "640px",
    },
    title: {
      type: String,
      default: null,
    },
    okText: {
      type: String,
      default: "确 认",
    },
    cancelText: {
      type: String,
      default: "取 消",
    },
  },
  methods: {
    handleConfirm() {
      this.$emit("confirm");
    },

    handleCancel() {
      this.$emit("update:visible", false);
      this.$emit("cancel");
    },

    close() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  z-index: 10000;
  background-color: #ffffff;
  box-shadow: 0px 0px 10px 0px #2f68bd;
  border-radius: 8px;
  //margin-top: 10% !important;
}
/deep/.el-dialog__body {
  padding: 24px 40px 12px 40px;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #e5e5e5;
  box-sizing: border-box;
  padding: 16px 30px;
}
.dialog-footer {
  text-align: center;
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>