<template>
  <div :class="prefixCls" :style="{ width: barWidth, transition: '0.3s all' }">
    <div style="float: left">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div style="float: right">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterToolBar',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-footer-toolbar',
    },
    siderWidth: {
      type: Number,
      default: undefined,
    },
    extra: {
      type: [String, Object],
      default: '',
    },
  },
  computed: {
    barWidth() {
      return `calc(100% - 256px)`
    },
  },
}
</script>

<style lang="less" scoped></style>
