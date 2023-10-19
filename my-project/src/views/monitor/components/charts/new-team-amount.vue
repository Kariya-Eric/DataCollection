<template>
  <div>
    <div class="echart" ref="newTeamAmount"></div>
  </div>
</template>

<script>
import echarts from './echarts'
export default {
  name: 'NewTeamAmount',
  data() {
    return {
      xAxis: ['2019-2020', '2020-2021', '2021-2022'],
      data: [23, 46, 50]
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const parentNode = this.$refs.newTeamAmount.parentNode.parentNode
      // 基本柱状图
      const option = {
        grid: { top: '18%', left: '16%', right: '8%', bottom: '12%' },
        tooltip: { trigger: 'item' },
        title: { text: '新发展教职工党员' },
        yAxis: { type: 'value', min: 20 },
        xAxis: { type: 'category', data: this.xAxis },
        series: [{ data: this.data, type: 'line' }]
      }
      const myChart = echarts.init(this.$refs.newTeamAmount)
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
