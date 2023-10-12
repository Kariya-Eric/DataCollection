<template>
  <div style="width: 100%">
    <a-divider :orientation="orientation">
      <span :style="titleStyle">{{ title }}</span>
    </a-divider>
  </div>
</template>

<script>
export default {
  name: 'FormDivider',
  props: ['title', 'fontSize', 'orientation'],
  computed: {
    titleStyle() {
      return {
        fontSize: this.fontSize + 'px',
        fontWeight: 'bold',
        letterSpacing: '0.15em'
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-divider {
  margin: 8px 0;
}
</style>
