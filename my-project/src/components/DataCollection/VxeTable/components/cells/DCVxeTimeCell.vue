<template>
  <a-time-picker ref="timePicker" :value="innerDateValue" allowClear dropdownClassName="dc-vxe-date-picker" style="min-width: 0" v-bind="cellProps" @change="handleChange" />
</template>

<script>
import moment from 'moment'
import DCVxeCellMixins, { dispatchEvent } from '../../mixins/DCVxeCellMixins'

export default {
  name: 'DCVxeTimeCell',
  mixins: [DCVxeCellMixins],
  props: {},
  data() {
    return {
      innerDateValue: null,
      dateFormat: 'HH:mm:ss'
    }
  },
  watch: {
    innerValue: {
      immediate: true,
      handler(val) {
        if (val == null || val === '') {
          this.innerDateValue = null
        } else {
          this.innerDateValue = moment(val, this.dateFormat)
        }
      }
    }
  },
  methods: {
    handleChange(mom, dateStr) {
      this.handleChangeCommon(dateStr)
    }
  },
  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    aopEvents: {
      editActived(event) {
        dispatchEvent.call(this, event, 'ant-calendar-picker', el => el.children[0].dispatchEvent(event.$event))
      }
    }
  }
}
</script>

<style scoped></style>
