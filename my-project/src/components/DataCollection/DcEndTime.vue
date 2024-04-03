<template>
  <div class="count-content" :style="{ color: blueFlag ? '#2f68bd' : '#c45c57' }">
    <span class="num" :style="{ backgroundColor: blueFlag ? '#e1edff' : '#ffe4e7' }">{{ dayString }}</span>
    <span class="word">天</span>
    <span class="num" :style="{ backgroundColor: blueFlag ? '#e1edff' : '#ffe4e7' }">{{ hourString }}</span>
    <span class="word">:</span>
    <span class="num" :style="{ backgroundColor: blueFlag ? '#e1edff' : '#ffe4e7' }">{{ minuteString }}</span>
    <!-- <span class="word">:</span>
    <span class="num" :style="{ backgroundColor: blueFlag ? '#e1edff' : '#ffe4e7' }">{{ secondString }}</span> -->
  </div>
</template>

<script>
export default {
  props: {
    remainTime: {
      // 倒计时间总秒数
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      day: '',
      hour: '',
      minute: '',
      second: '',
      promiseTimer: ''
    }
  },
  computed: {
    hourString() {
      return this.formatNum(this.hour, true)
    },
    minuteString() {
      return this.formatNum(this.minute, true)
    },
    secondString() {
      return this.formatNum(this.second, true)
    },
    dayString() {
      return this.formatNum(this.day, false)
    },
    blueFlag() {
      return this.remainTime >= 24 * 3600
    }
  },
  mounted() {
    if (this.remainTime > 0) {
      this.day = Math.floor(this.remainTime / 3600 / 24)
      this.hour = Math.floor((this.remainTime / 3600) % 24)
      this.minute = Math.floor((this.remainTime / 60) % 60)
      this.second = Math.floor(this.remainTime % 60)
      this.countDown()
    }
  },
  methods: {
    countDown() {
      let self = this
      clearInterval(this.promiseTimer)
      this.promiseTimer = setInterval(function () {
        if (self.day === 0) {
          if (self.hour === 0) {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.second = 0
              self.$emit('countDowmEnd', true)
              clearInterval(self.promiseTimer)
            } else {
              self.second -= 1
            }
          } else {
            if (self.minute !== 0 && self.second === 0) {
              self.second = 59
              self.minute -= 1
            } else if (self.minute === 0 && self.second === 0) {
              self.hour -= 1
              self.minute = 59
              self.second = 59
            } else {
              self.second -= 1
            }
          }
        } else {
          if (self.hour === 0 && self.minute === 0 && self.second === 0) {
            self.day -= 1
            self.hour = 23
            self.minute = 60
            self.second = 60
          } else {
            if (self.hour === 0) {
              if (self.minute !== 0 && self.second === 0) {
                self.second = 59
                self.minute -= 1
              } else if (self.minute === 0 && self.second === 0) {
                self.second = 0
              } else {
                self.second -= 1
              }
            } else {
              if (self.minute !== 0 && self.second === 0) {
                self.second = 59
                self.minute -= 1
              } else if (self.minute === 0 && self.second === 0) {
                self.hour -= 1
                self.minute = 59
                self.second = 59
              } else {
                self.second -= 1
              }
            }
          }
        }
      }, 1000)
    },
    formatNum(num, zeroFlag) {
      if (zeroFlag) {
        return num < 10 ? '0' + num : '' + num
      }
      if (num === '') {
        return '0'
      }
      return '' + num
    }
  }
}
</script>
<style scoped lang="less">
.count-content {
  font-weight: bold;
  .num {
    display: inline-block;
    padding: 0px 8px;
    height: 30px;
    font-size: 20px;
    margin: 0px 8px;
  }
  .word {
    font-size: 18px;
  }
}
</style>
