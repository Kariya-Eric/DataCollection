<template>
  <el-select :clearable="clearable" v-bind="$attrs" v-on="$listeners" :style="{ width }" size="small" v-model="selectVal" :multiple="multiple" @focus="setOptionWidth">
    <el-option
      v-for="(item, index) in options"
      :label="fields.label ? item[fields.label] : item"
      :value="fields.value ? item[fields.value] : item"
      :key="fields.label ? item[fields.label] : index"
      :style="{ width: optionWidth }"
      :title="fields.label ? item[fields.label] : item"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'DcSelect',
  props: {
    clearable: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Array, Number],
      default: undefined
    },
    multiple: {
      type: Boolean,
      default: false,
      required: false
    },
    options: {
      type: Array,
      default: () => [],
      required: true
    },
    width: {
      type: String,
      default: '100%',
      required: false
    },
    fields: {
      type: Object,
      required: false,
      default: () => {
        return {
          label: 'name',
          value: 'id'
        }
      }
    }
  },
  data() {
    return {
      selectVal: undefined,
      optionWidth: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectVal = val
      },
      immediate: true
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    setOptionWidth(event) {
      this.$nextTick(() => (this.optionWidth = event.srcElement.offsetWidth + 'px'))
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-input__suffix {
  line-height: 32px !important;
}
</style>
