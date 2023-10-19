<template>
  <div>
    <div class="echart" ref="ageDistributionManager"></div>
  </div>
</template>

<script>
import echarts from './echarts'
export default {
  name: 'AgeDistributionManager',
  data() {
    return {
      yAxis: ['35岁以下', '36-45岁', '46-55岁', '56岁以上'],
      yData: [2, 13, 12, 6]
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const parentNode = this.$refs.ageDistributionManager.parentNode.parentNode
      // 基本柱状图
      const option = {
        grid: { top: '15%', left: '16%', right: '8%', bottom: '15%' },
        tooltip: { trigger: 'item' },
        title: { text: '年龄分布' },
        xAxis: { type: 'value' },
        yAxis: { type: 'category', data: this.yAxis, axisLabel: { interval: 0, rotate: 45 } },
        series: [{ type: 'bar', data: this.yData, label: { show: true, position: 'right' } }]
      }
      const myChart = echarts.init(this.$refs.ageDistributionManager)
      myChart.setOption(option)
      myChart.resize({
        width: parentNode.clientWidth + 'px',
        height: parentNode.clientHeight + 'px'
      })
      //随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        myChart.resize({
          width: parentNode.clientWidth + 'px',
          height: parentNode.clientHeight + 'px'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.echart {
  width: 400px;
  height: 250px;
}
</style>
