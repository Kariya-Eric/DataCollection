<template>
  <a-input ref="input" :value="innerValue" v-bind="cellProps" @blur="handleBlur" @change="handleChange">
    <a-icon v-if="prefixIcon" slot="prefix" :type="prefixIcon" />
  </a-input>
</template>

<script>
import DCVxeCellMixins from '../../mixins/DCVxeCellMixin'
export default {
  name: 'DCVxeInputCell',
  mixins: [DCVxeCellMixins],
  computed: {
    prefixIcon() {
      if (this.$type === 'inputPhone') {
        return 'mobile'
      } else if (this.$type === 'inputMail') {
        return 'mail'
      } else if (this.$type === 'inputLink') {
        return 'link'
      }
      return undefined
    }
  },
  methods: {
    /** 处理change事件 */
    handleChange(event) {
      let { value } = event.target
      let change = true
      // 触发事件，存储输入的值
      if (change) {
        this.handleChangeCommon(value)
      }
    },

    /** 处理blur失去焦点事件 */
    handleBlur(event) {
      let { target } = event
      this.handleBlurCommon(target.value)
    }
  },
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    installOptions: {
      // 自动聚焦的 class 类名
      autofocus: '.ant-input'
    },
    getValue(value) {
      return value
    }
  }
}
</script>

<style scoped></style>
