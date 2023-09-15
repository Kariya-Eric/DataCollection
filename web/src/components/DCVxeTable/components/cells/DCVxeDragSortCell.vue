<template>
  <div class="dc-vxe-ds-icons">
    <span class="drag-btn"><a-icon type="drag"></a-icon></span>
  </div>
</template>

<script>
import DCVxeCellMixins from '../../mixins/DCVxeCellMixin'
export default {
  name: 'DCVxeDragSortCell',
  mixins: [DCVxeCellMixins],
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    // 【功能开关】
    switches: {
      editRender: false
    }
  }
}
</script>

<style lang="scss">
.dc-vxe-ds-icons {
  /*cursor: move;*/
  cursor: pointer;
  text-align: center;
  margin-left: 8px;
  line-height: 44px;
}
</style>
