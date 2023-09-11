<template>
  <a-date-picker
    ref="datePicker"
    :value="innerDateValue"
    allowClear
    :format="dateFormat"
    :showTime="isDatetime"
    dropdownClassName="dc-vxe-date-picker"
    style="min-width: 0"
    v-bind="cellProps"
    @change="handleChange"
  />
</template>

<script>
import moment from 'moment'
import { DCVXETypes } from '../../index'
import DCVxeCellMixins, { dispatchEvent } from '../../mixins/DCVxeCellMixin'
import { DatePicker } from 'ant-design-vue'

export default {
  name: 'DCVxeDateCell',
  mixins: [DCVxeCellMixins],
  components: {
    ADatePicker: DatePicker
  },
  data() {
    return {
      innerDateValue: null
    }
  },
  computed: {
    isDatetime() {
      return this.$type === DCVXETypes.datetime
    },
    dateFormat() {
      let format = this.originColumn.format
      return format ? format : this.isDatetime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
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
