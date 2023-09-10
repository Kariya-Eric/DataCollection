<template>
  <el-dialog :visible="visible" :title="title" :width="width" v-bind="$attrs" v-on="$listeners" :close-on-click-modal="false" :close-on-press-escape="false">
    <div slot="title" class="dialog-title" v-if="!title">
      <slot name="title"></slot>
    </div>
    <slot> </slot>
    <div slot="footer" class="dialog-footer" v-if="submitButtons">
      <el-button @click="handleCancel">{{ cancelText }}</el-button>
      <el-button type="primary" @click="handleConfirm" :disabled="disabled">{{ okText }} </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DCDialog',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '640px'
    },
    title: {
      type: String,
      default: null
    },
    submitButtons: {
      type: Boolean,
      default: true
    },
    okText: {
      type: String,
      default: '确 认'
    },
    cancelText: {
      type: String,
      default: '取 消'
    }
  },
  methods: {
    handleConfirm() {
      this.$emit('confirm')
    },

    handleCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },

    close() {
      this.$emit('update:visible', false)
    }
  }
}
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
</style>
