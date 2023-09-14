<template>
  <a-select
    ref="select"
    :value="innerValue"
    allowClear
    v-bind="selectProps"
    style="width: 100%"
    @blur="handleBlurCommon"
    @change="handleChangeCommon"
    showSearch
  >
    <div v-if="loading" slot="notFoundContent">
      <a-icon type="loading" />
      <span>&nbsp;加载中…</span>
    </div>

    <template v-for="option of selectOptions">
      <a-select-option :key="option.value" :value="option.value" :disabled="option.disabled">
        <span>{{ option.text || option.label || option.title || option.value }}</span>
      </a-select-option>
    </template>
  </a-select>
</template>

<script>
import DCVxeCellMixins, { dispatchEvent } from '../../mixins/DCVxeCellMixin'
import { DCVXETypes } from '../../index'
import { filterDictText } from '../../utils/cellUtils'
export default {
  name: 'DCVxeSelectCell',
  mixins: [DCVxeCellMixins],
  data() {
    return {
      loading: false
    }
  },
  computed: {
    selectProps() {
      let props = { ...this.cellProps }
      return props
    },
    // 下拉选项
    selectOptions() {
      return this.originColumn.options
    }
  },
  created() {
    let multiple = [DCVXETypes.selectMultiple]
    if (multiple.includes(this.$type)) {
      // 处理多选
      let props = this.originColumn.props || {}
      props['mode'] = 'multiple'
      props['maxTagCount'] = 1
      this.$set(this.originColumn, 'props', props)
    }
  },

  // 【组件增强】注释详见：DCVxeCellMixins.js
  enhanced: {
    aopEvents: {
      editActived(event) {
        dispatchEvent.call(this, event, 'ant-select')
      }
    },
    translate: {
      enabled: true,
      async handler(value) {
        let options = this.column.own.options
        return filterDictText(options, value)
      }
    },
    getValue(value) {
      if (Array.isArray(value)) {
        return value.join(',')
      } else {
        return value
      }
    },
    setValue(value) {
      let {
        column: { own: col },
        params: { $table }
      } = this
      // 判断是否是多选
      if ((col.props || {})['mode'] === 'multiple') {
        $table.$set(col.props, 'maxTagCount', 1)
      }
      if (value != null && value !== '') {
        if (typeof value === 'string') {
          return value === '' ? [] : value.split(',')
        }
        return value
      } else {
        return undefined
      }
    }
  }
}
</script>

<style scoped></style>
