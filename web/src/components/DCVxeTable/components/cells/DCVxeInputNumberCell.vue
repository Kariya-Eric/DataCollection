<template>
  <el-input-number
    ref="inputNumber"
    :value="innerValue"
    v-bind="cellProps"
    @blur="handleBlur"
    @change="handleChange"
    controls-position="right"
    style="width: 100%"
    :min="min"
    :max="max"
    :precision="precision"
  />
</template>

<script>
import { DCVXETypes } from '../../index'
import DCVxeCellMixins from '../../mixins/DCVxeCellMixin'
const NumberRegExp = /^-?\d+\.?\d*$/
export default {
  name: 'DCVxeInputNumberCell',
  mixins: [DCVxeCellMixins],
  computed: {
    min() {
      return this.originColumn.min
    },
    max() {
      return this.originColumn.max
    },
    precision() {
      return this.originColumn.precision
    }
  },
  methods: {
    /** 处理change事件 */
    handleChange(value) {
      this.handleChangeCommon(value)
    },

    /** 处理blur失去焦点事件 */
    handleBlur(event) {
      let { target } = event
      if (!NumberRegExp.test(target.value)) {
        target.value = ''
      } else {
        target.value = Number.parseFloat(target.value)
      }
      this.handleChangeCommon(target.value)

      this.handleBlurCommon(target.value)
    }
  },
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    installOptions: {
      // 自动聚焦的 class 类名
      autofocus: '.el-input__inner'
    },
    getValue(value) {
      if (this.$type === DCVXETypes.inputNumber && typeof value === 'string') {
        if (NumberRegExp.test(value)) {
          return Number.parseFloat(value)
        }
      }
      return value
    }
  }
}
</script>

<style scoped></style>
