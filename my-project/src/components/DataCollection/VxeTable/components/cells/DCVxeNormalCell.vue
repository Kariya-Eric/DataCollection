<template>
  <reload-effect :vNode="innerValue" :effect="reloadEffect" @effect-end="handleEffectEnd" />
</template>

<script>
import ReloadEffect from './ReloadEffect'
import DCVxeCellMixins from '../../mixins/DCVxeCellMixins'

export default {
  name: 'DCVxeNormalCell',
  mixins: [DCVxeCellMixins],
  components: { ReloadEffect },
  computed: {
    reloadEffectRowKeysMap() {
      return this.renderOptions.reloadEffectRowKeysMap
    },
    reloadEffect() {
      return (this.renderOptions.reloadEffect && this.reloadEffectRowKeysMap[this.row.id]) === true
    }
  },
  methods: {
    // 特效结束
    handleEffectEnd() {
      this.$delete(this.reloadEffectRowKeysMap, this.row.id)
    }
  },
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    switches: {
      editRender: false
    }
  }
}
</script>

<style scoped></style>
