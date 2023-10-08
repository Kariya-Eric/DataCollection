<template>
  <div style="width: 100%">
    <div :style="titleStyle">{{ title }}</div>
    <a-divider />
  </div>
</template>

<script>
export default {
  name: 'FormDivider',
  props: ['title', 'fontSize'],
  computed: {
    titleStyle() {
      return {
        fontSize: this.fontSize + 'px',
        margin: '12px 0 0 24px',
        fontWeight: 'bold',
        letterSpacing: '0.15em'
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-divider {
  margin: 12px 0;
}
</style>
