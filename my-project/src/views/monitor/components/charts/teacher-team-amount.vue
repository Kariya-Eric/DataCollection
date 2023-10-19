<template>
  <div>
    <div class="echart" ref="teacherTeamAmount"></div>
  </div>
</template>

<script>
import echarts from './echarts'
export default {
  name: 'TeacherTeamAmount',
  data() {
    return {
      xAxis: ['2019-2020', '2020-2021', '2021-2022'],
      teamData: [1906, 1902, 1575],
      totalData: [2100, 2400, 2400]
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const parentNode = this.$refs.teacherTeamAmount.parentNode.parentNode
      // 基本柱状图
      const option = {
        grid: { top: '18%', left: '16%', right: '8%', bottom: '12%' },
        tooltip: { trigger: 'axis' },
        title: { text: '教职工党员数量' },
        yAxis: { type: 'value' },
        xAxis: { type: 'category', data: this.xAxis },
        series: [
          { type: 'bar', name: '党员数', data: this.teamData, stack: 'total' },
          { type: 'bar', name: '教职工总数', data: this.totalData, stack: 'total' }
        ]
      }
      const myChart = echarts.init(this.$refs.teacherTeamAmount)
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
