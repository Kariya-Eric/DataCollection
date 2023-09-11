<template>
  <a-progress :class="clazz" :percent="innerValue" size="small" v-bind="cellProps" />
</template>

<script>
import DCVxeCellMixins from '../../mixins/DCVxeCellMixin'
import { Progress } from 'ant-design-vue'
// DCVxe 进度条组件
export default {
  name: 'DCVxeProgressCell',
  mixins: [DCVxeCellMixins],
  components: { AProgress: Progress },
  data() {
    return {}
  },
  computed: {
    clazz() {
      return {
        'dc-vxe-progress': true,
        'no-animation': this.scrolling
      }
    },
    scrolling() {
      return !!this.renderOptions.scrolling
    }
  },
  methods: {},
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    switches: {
      editRender: false
    },
    setValue(value) {
      try {
        if (typeof value !== 'number') {
          return Number.parseFloat(value)
        } else {
          return value
        }
      } catch {
        return 0
      }
    }
  }
}
</script>

<style scoped lang="scss">
// 关闭进度条的动画，防止滚动时动态赋值出现问题
.dc-vxe-progress.no-animation {
  /deep/ .ant-progress-success-bg,
  /deep/ .ant-progress-bg {
    transition: none !important;
  }
}
</style>
