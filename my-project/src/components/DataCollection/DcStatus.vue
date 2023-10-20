<template>
  <span>
    <div class="circle-shadow" :style="dotStyle"></div>
    <span :style="spanStyle">{{ name }}</span>
  </span>
</template>

<script>
export default {
  name: 'DCStatus',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'blue'
    }
  },
  computed: {
    spanStyle() {
      if (this.color == 'green') {
        return { 'margin-left': '8px', color: '#2B9E77' }
      } else if (this.color == 'red') {
        return { 'margin-left': '8px', color: '#E23322' }
      } else if (this.color == 'yellow') {
        return { 'margin-left': '8px', color: '#F2951B' }
      } else if (this.color == 'grey') {
        return { 'margin-left': '8px', color: '#989A9F' }
      }
      return { 'margin-left': '8px', color: '#2F68BD' }
    },
    dotStyle() {
      if (this.color == 'green') {
        return { 'background-color': '#2B9E77', 'box-shadow': '0 0 0 2px #CAE4E4' }
      } else if (this.color == 'red') {
        return { 'background-color': '#E23322', 'box-shadow': '0 0 0 2px #ECBBBC' }
      } else if (this.color == 'yellow') {
        return { 'background-color': '#F2951B', 'box-shadow': '0 0 0 2px #FFDEB3' }
      } else if (this.color == 'grey') {
        return { 'background-color': '#989A9F', 'box-shadow': '0 0 0 2px #E0E0E2' }
      }
      return { 'background-color': '#2F68BD', 'box-shadow': '0 0 0 2px #B6CBEB' }
    }
  }
}
</script>

<style scoped lang="less">
.circle-shadow {
  display: inline-block;
  margin: auto;
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
</style>
