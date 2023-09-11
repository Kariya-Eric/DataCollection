<template>
  <el-date-picker
    v-model="momVal"
    :type="type"
    :value-format="dateFormat"
    :format="dateFormat"
    v-bind="$attrs"
    v-on="$listeners"
    @change="change"
  ></el-date-picker>
</template>

<script>
import moment from 'moment'
export default {
  name: 'DatePicker',
  props: {
    value: { type: String, required: false },
    type: { type: String, default: 'date' }
  },
  data() {
    return {
      momVal: new Date(this.value)
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value(val) {
      if (!val) {
        this.momVal = null
      } else {
        this.momVal = new Date(this.value)
      }
    }
  },
  computed: {
    dateFormat() {
      if (this.type === 'date') {
        return 'yyyy-MM-dd'
      } else if (this.type === 'month') {
        return 'yyyy-MM'
      } else {
        return 'yyyy'
      }
    }
  },
  methods: {
    moment,
    change(val) {
      this.$emit('change', moment(val, this.dateFormat))
    }
  }
}
</script>

<style></style>
