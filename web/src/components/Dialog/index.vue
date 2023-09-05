<template>
  <div class="dialog">
    <el-dialog
      :visible="visible"
      :title="title"
      :width="width"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <div slot="title" class="dialog-title">
        <slot name="title"></slot>
      </div>
      <div class="dialog-body">
        <slot> </slot>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">{{ cancelText }}</el-button>
        <el-button type="primary" @click="handleConfirm">{{
          okText
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Dialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: "550px",
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
    handleConfirm() {},

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
.dialog {
  width: 550px;
  /deep/.el-dialog {
    z-index: 10000;
    background-color: #ffffff;
    box-shadow: 0px 0px 10px 0px rgba(17, 130, 251, 0.5);
    border-radius: 8px;
    //margin-top: 10% !important;
  }
  /deep/.el-dialog__body {
    padding: 20px 20px 12px 20px;
  }
  /deep/.el-dialog__header {
    border-bottom: 1px solid #f6f7f9;
    box-sizing: border-box;
    padding: 16px 30px;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>