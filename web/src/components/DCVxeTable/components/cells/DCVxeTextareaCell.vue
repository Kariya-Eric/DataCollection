<template>
  <input-textarea :value="innerValue" :width="300" :height="210" v-bind="cellProps" style="width: 100%" @change="handleChangeCommon" />
</template>

<script>
import DCVxeCellMixins, { dispatchEvent } from '../../mixins/DCVxeCellMixin'

export default {
  name: 'DCVxeTextareaCell',
  mixins: [DCVxeCellMixins],
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    installOptions: {
      autofocus: '.ant-input'
    },
    aopEvents: {
      editActived(event) {
        dispatchEvent.call(this, event, 'anticon-fullscreen')
      }
    }
  }
}
</script>

<style scoped></style>
