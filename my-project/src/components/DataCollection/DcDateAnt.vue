<template>
  <a-date-picker
    drowdownClassName="dc-date-picker"
    :disabled="disabled"
    v-model="momVal"
    :showTime="showTime"
    :format="format"
    :placeholder="placeholder"
    v-bind="$attrs"
    @change="handleDateChange"
    @panelChange="panelChange"
    @openChange="openChange"
    :open="isOpen"
    style="width: 100%"
  />
</template>

<script>
import moment from 'moment'
export default {
  name: 'DcDate',
  props: {
    placeholder: { type: String, default: '', required: false },
    value: { type: String, required: false },
    format: { type: String, default: 'YYYY-MM-DD', required: false },
    disabled: { type: Boolean, required: false, default: false },
    showTime: { type: Boolean, required: false, default: false }
  },
  data() {
    let dateStr = this.value
    return {
      isOpen: false,
      momVal: !dateStr ? null : moment(dateStr, this.format)
    }
  },
  watch: {
    value(val) {
      if (!val) {
        console.log(val, this.format)
        this.momVal = null
      } else {
        this.momVal = moment(val, this.format)
      }
    }
  },
  methods: {
    moment,
    handleDateChange(mom, dateStr) {
      this.$emit('change', dateStr)
    },
    panelChange(value) {
      this.$emit('change', value.format(this.format))
      this.isOpen = false
    },
    openChange(status) {
      this.isOpen = status
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style lang="less" scoped>
/deep/.anticon {
  color: rgba(0, 0, 0, 0.25);
}
</style>
