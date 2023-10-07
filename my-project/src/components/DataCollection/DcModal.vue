<template>
  <a-modal
    ref="modal"
    :class="getClass(modalClass)"
    :style="getStyle(modalStyle)"
    :visible="visible"
    v-bind="_attrs"
    v-on="$listeners"
    @ok="handleOk"
    @cancel="handleCancel"
    :keyboard="false"
    :maskClosable="false"
    :closable="false"
    :footer="null"
    :destroyOnClose="destroyOnClose"
    wrapClassName="parent-container"
  >
    <template slot="title" v-if="!title">
      <slot name="title"></slot>
    </template>
    <slot></slot>
  </a-modal>
</template>

<script>
import { getClass, getStyle } from '../_util/util'

export default {
  name: 'DcModal',
  props: {
    title: String,
    // 可使用 .sync 修饰符
    visible: Boolean,
    // 点击确定按钮的时候是否关闭弹窗
    okClose: {
      type: Boolean,
      default: true
    },
    // 关闭时销毁弹窗内容
    destroyOnClose: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 一些未处理的参数或特殊处理的参数绑定到 a-modal 上
    _attrs() {
      let attrs = { ...this.$attrs }
      attrs['width'] = '100%'
      return attrs
    },
    modalClass() {
      return { 'dc-modal-box': true, fullscreen: true, 'no-title': false, 'no-footer': true }
    },
    modalStyle() {
      let style = {}
      style['top'] = '0'
      return style
    }
  },

  methods: {
    getClass(clazz) {
      return { ...getClass(this), ...clazz }
    },
    getStyle(style) {
      return { ...getStyle(this), ...style }
    },

    close() {
      this.$emit('update:visible', false)
    },

    handleOk() {
      if (this.okClose) {
        this.close()
      }
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style lang="less">
.parent-container {
  overflow-y: hidden;
}
.dc-modal-box {
  &.fullscreen {
    top: 0;
    left: 0;
    padding: 0;
    & .ant-modal {
      top: 0;
      padding: 0;
      height: 100vh;
    }
    & .ant-modal-content {
      height: 100vh;
      border-radius: 0;

      & .ant-modal-body {
        /* title 和 footer 各占 55px */
        height: calc(100% - 55px - 55px);
        overflow: auto;
      }
    }
    &.no-title,
    &.no-footer {
      .ant-modal-body {
        height: calc(100% - 55px);
      }
    }
    &.no-title.no-footer {
      .ant-modal-body {
        height: 100%;
      }
    }
  }
}
</style>
