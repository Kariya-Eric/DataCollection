<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts';
require('echarts/theme/macarons'); // echarts theme
import { debounce } from '@/utils';

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    xData: {
      type: Array,
      required: true
    },
    yData: {
      type: Array,
      required: true
    },
    isShowXAsix: {
      type: Boolean,
      default: true
    },
    isShowYAsix: {
      type: Boolean,
      default: true
    },
    legend: {
      type: String,
      default: '',
      required: false
    },
    axisPointerType: {
      type: String,
      default: 'cross',
      required: false
    },
    isShowGrid: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      sidebarElm: null
    };
  },
  watch: {
    xData: {
      deep: true,
      handler(val) {
        this.setOptions();
      }
    }
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHandler = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener('resize', this.__resizeHandler);
    }

    // 监听侧边栏的变化
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0];
    this.sidebarElm &&
      this.sidebarElm.addEventListener(
        'transitionend',
        this.sidebarResizeHandler
      );
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener('resize', this.__resizeHandler);
    }

    this.sidebarElm &&
      this.sidebarElm.removeEventListener(
        'transitionend',
        this.sidebarResizeHandler
      );

    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler();
      }
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: this.xData,
          show: this.isShowXAsix,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10
          // bottom: 0,
          // top: 0,
          // containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: this.axisPointerType
          },
          padding: [5, 10]
        },
        yAxis: {
          show: this.isShowYAsix,
          axisTick: {
            show: false
          }
        },
        legend: {
          data: [this.legend]
        },
        series: [
          {
            name: this.legend,
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#74BCFF',
                lineStyle: {
                  color: '#74BCFF',
                  width: 2
                },
                areaStyle: {
                  color: '#74BCFF'
                }
              }
            },
            data: this.yData,
            animationDuration: 1000,
            animationEasing: 'quadraticOut'
          }
        ]
      });
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons');
      this.setOptions();
    }
  }
};
</script>
