<template>
  <div>
    <div class="echart" ref="academicDistribution"></div>
  </div>
</template>

<script>
import echarts from './echarts'
export default {
  name: 'AcademicDistribution',
  data() {
    return {
      pieData: [
        { value: 833, name: '无学位' },
        { value: 5000, name: '硕士' },
        { value: 833, name: '博士' },
        { value: 3333, name: '学士' }
      ]
    }
  },
  computed: {
    total() {
      return this.pieData.reduce((a, b) => {
        return a + b.value * 1
      }, 0)
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const parentNode = this.$refs.academicDistribution.parentNode.parentNode
      const option = {
        title: { text: '学位分布', left: 'left' },
        legend: { orient: 'vertical', right: 15 },
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            data: this.pieData,
            radius: ['55%', '70%'],
            center: ['40%', '50%'], //饼图位置
            itemStyle: {
              borderRadius: 2,
              borderColor: '#fff',
              borderWidth: 2
            },
            labelLine: {
              normal: {
                length: 5,
                length2: 10,
                lineStyle: {
                  color: '#333'
                }
              }
            },
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: params => {
                  //设置lable显示Value所占百分比
                  return ((params.value / this.total) * 100).toFixed(2) + '%'
                }
              }
            }
          }
        ]
      }
      const myChart = echarts.init(this.$refs.academicDistribution)
      myChart.setOption(option)
      myChart.resize({
        width: parentNode.clientWidth + 'px',
        height: parentNode.clientHeight + 'px'
      })
      //随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        myChart.resize()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.echart {
  width: 385px;
  height: 250px;
}
</style>
