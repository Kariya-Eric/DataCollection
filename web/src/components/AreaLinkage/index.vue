<template>
  <div class="area-linkage">
    <div v-if="reloading">
      <span> Reloading... </span>
    </div>
    <area-cascader :value="innerValue" separator="-" :data="pcaa" :level="1" :style="{ width }" v-bind="$attrs" v-on="_listeners" @change="handleChange" />
  </div>
</template>

<script>
import Area from './Area'

export default {
  name: 'AreaLinkage',
  props: {
    value: {
      type: String,
      required: false
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      pcaa: this.$pcaa,
      innerValue: [],
      usedListeners: ['change'],
      reloading: false,
      areaData: ''
    }
  },
  computed: {
    _listeners() {
      let listeners = { ...this.$listeners }
      // 去掉已使用的事件，防止冲突
      this.usedListeners.forEach(key => {
        delete listeners[key]
      })
      return listeners
    }
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        this.loadDataByValue(this.value)
      }
    }
  },
  created() {
    this.initAreaData()
  },
  methods: {
    /** 重新加载组件 */
    reload() {
      this.reloading = true
      this.$nextTick(() => (this.reloading = false))
    },

    /** 通过 value 反推 options */
    loadDataByValue(value) {
      if (!value || value.length === 0) {
        this.innerValue = []
      } else {
        this.initAreaData()
        let arr = this.areaData.getRealCode(value)
        this.innerValue = arr
      }
      this.reload()
    },
    /** 通过地区code获取子级 */
    loadDataByCode(value) {
      let options = []
      let data = this.pcaa[value]
      if (data) {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            options.push({ value: key, label: data[key] })
          }
        }
        return options
      } else {
        return []
      }
    },
    /** 判断是否有子节点 */
    hasChildren(options) {
      options.forEach(option => {
        let data = this.loadDataByCode(option.value)
        option.isLeaf = data.length === 0
      })
    },
    handleChange(values) {
      let value = values[values.length - 1]
      this.$emit('change', value)
    },
    initAreaData() {
      if (!this.areaData) {
        this.areaData = new Area(this.$pcaa)
      }
    }
  },
  model: { prop: 'value', event: 'change' }
}
</script>

<style lang="scss" scoped>
.area-linkage {
  height: 40px;
  /deep/ .area-cascader-wrap .area-select {
    width: 100%;
  }

  /deep/ .area-select .area-selected-trigger {
    line-height: 1.15;
  }
}
</style>
