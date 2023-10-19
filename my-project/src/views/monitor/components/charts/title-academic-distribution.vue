<template>
  <div>
    <div class="echart" ref="titleAcademicDistribution"></div>
  </div>
</template>

<script>
import echarts from './echarts'
export default {
  name: 'TitleAcademicDistribution',
  data() {
    return {
      pieData1: [
        { value: 606, name: '正高级' },
        { value: 303, name: '副高级' },
        { value: 5455, name: '中级' },
        { value: 1818, name: '初级' },
        { value: 1818, name: '无职称' }
      ],
      pieData2: [
        { value: 303, name: '无学位' },
        { value: 6061, name: '硕士' },
        { value: 2424, name: '博士' },
        { value: 1212, name: '学士' }
      ]
    }
  },
  computed: {
    total1() {
      return this.pieData1.reduce((a, b) => {
        return a + b.value * 1
      }, 0)
    },
    total2() {
      return this.pieData2.reduce((a, b) => {
        return a + b.value * 1
      }, 0)
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const parentNode = this.$refs.titleAcademicDistribution.parentNode.parentNode
      const option = {
        title: [
          {
            text: '职称分布'
          },
          {
            text: '最高学位分布',
            left: '50%'
          }
        ],
        tooltip: { trigger: 'item' },
        legend: { top: 'bottom' },
        series: [
          {
            type: 'pie',
            data: this.pieData1,
            radius: ['45%', '60%'],
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
                  return ((params.value / this.total1) * 100).toFixed(2) + '%'
                }
              }
            },
            left: 0,
            right: '50%'
          },
          {
            type: 'pie',
            data: this.pieData2,
            radius: ['45%', '60%'],
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
                  return ((params.value / this.total2) * 100).toFixed(2) + '%'
                }
              }
            },
            left: '50%',
            right: 0
          }
        ]
      }
      const myChart = echarts.init(this.$refs.titleAcademicDistribution)
      myChart.setOption(option)
      myChart.resize({
        width: parentNode.clientWidth - 48 + 'px',
        height: parentNode.clientHeight - 48 + 'px'
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
