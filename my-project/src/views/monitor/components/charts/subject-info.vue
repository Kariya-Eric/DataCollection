<template>
  <div>
    <div class="echart" ref="subjectInfo"></div>
  </div>
</template>

<script>
import echarts from './echarts'
export default {
  name: 'SubjectInfo',
  data() {
    return {
      pieData1: [
        { value: 1, name: '哲学' },
        { value: 465, name: '经济学' },
        { value: 465, name: '法学' },
        { value: 930, name: '教育学' },
        { value: 1395, name: '文学' },
        { value: 233, name: '历史学' },
        { value: 1512, name: '理学' },
        { value: 2093, name: '工学' },
        { value: 2, name: '农学' },
        { value: 3, name: '医学' },
        { value: 1279, name: '管理学' },
        { value: 1628, name: '艺术学' }
      ],
      pieData2: [
        { value: 1, name: '哲学' },
        { value: 750, name: '经济学' },
        { value: 750, name: '法学' },
        { value: 1000, name: '教育学' },
        { value: 1500, name: '文学' },
        { value: 250, name: '历史学' },
        { value: 1750, name: '理学' },
        { value: 1000, name: '工学' },
        { value: 2, name: '农学' },
        { value: 3, name: '医学' },
        { value: 1000, name: '管理学' },
        { value: 2000, name: '艺术学' }
      ],
      pieData3: [
        { value: 1, name: '哲学' },
        { value: 2, name: '经济学' },
        { value: 1, name: '法学' },
        { value: 1429, name: '教育学' },
        { value: 476, name: '文学' },
        { value: 476, name: '历史学' },
        { value: 1905, name: '理学' },
        { value: 2857, name: '工学' },
        { value: 2, name: '农学' },
        { value: 1, name: '医学' },
        { value: 1429, name: '管理学' },
        { value: 1429, name: '艺术学' }
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
    },
    total3() {
      return this.pieData3.reduce((a, b) => {
        return a + b.value * 1
      }, 0)
    }
  },
  mounted() {
    this.initEcharts()
  },
  methods: {
    initEcharts() {
      const parentNode = this.$refs.subjectInfo.parentNode.parentNode
      const option = {
        title: [
          {
            text: '本科专业布局'
          },
          {
            text: '国家级一流专业建设点布局',
            left: '33.33%'
          },
          {
            text: '省级一流专业建设点布局',
            left: '66.67%'
          }
        ],
        legend: {
          top: 'bottom'
        },
        series: [
          {
            type: 'pie',
            data: this.pieData1,
            radius: ['55%', '70%'],
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
            right: '66.6667%'
          },
          {
            type: 'pie',
            data: this.pieData2,
            radius: ['55%', '70%'],
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
            left: '33.3333%',
            right: '33.3333%'
          },
          {
            type: 'pie',
            data: this.pieData3,
            radius: ['55%', '70%'],
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
                  return ((params.value / this.total3) * 100).toFixed(2) + '%'
                }
              }
            },
            left: '66.6667%',
            right: 0
          }
        ]
      }
      const myChart = echarts.init(this.$refs.subjectInfo)
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
