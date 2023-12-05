<template>
  <el-date-picker
    v-model="dateVal"
    v-bind="$attrs"
    v-on="$listeners"
    :clearable="clearable"
    size="small"
    :style="{ width }"
    :type="mode"
    :format="format"
    :value-format="format"
    popper-class="el-date-popover"
  ></el-date-picker>
</template>

<script>
export default {
  name: 'DcDate',
  props: {
    value: {
      type: String,
      default: undefined
    },
    mode: {
      type: String,
      default: 'date'
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '100%',
      required: false
    }
  },
  data() {
    return {
      dateVal: ''
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      handler(newVal) {
        this.dateVal = newVal
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.el-date-popover {
  background-color: red;
}
</style>
