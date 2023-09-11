<template>
  <a-select
    ref="select"
    :value="innerValue"
    allowClear
    :filterOption="handleSelectFilterOption"
    v-bind="selectProps"
    style="width: 100%"
    @blur="handleBlur"
    @change="handleChange"
    @search="handleSearchSelect"
  >
    <div v-if="loading" slot="notFoundContent">
      <a-icon type="loading" />
      <span>&nbsp;加载中…</span>
    </div>

    <template>
      <a-select-option v-for="(option, index) in selectOptions" :key="index" :value="option.value" :disabled="option.disabled">
        <span>{{ option.text || option.label || option.title || option.value }}</span>
      </a-select-option>
    </template>
  </a-select>
</template>

<script>
import DCVxeCellMixins, { dispatchEvent } from '../../mixins/DCVxeCellMixin'
import { DCVXETypes } from '../../index'
import { filterDictText } from '../../utils/cellUtils'
import { Select, Icon } from 'ant-design-vue'
export default {
  name: 'DCVxeSelectCell',
  mixins: [DCVxeCellMixins],
  components: { ASelect: Select, AIcon: Icon },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    selectProps() {
      let props = { ...this.cellProps }
      // 判断select是否允许输入
      let { allowSearch, allowInput } = this.originColumn
      if (allowInput === true || allowSearch === true) {
        props['showSearch'] = true
      }
      return props
    },
    // 下拉选项
    selectOptions() {
      console.log('x', this.originColumn.options)
      return this.originColumn.options
    }
  },
  created() {
    let multiple = [DCVXETypes.selectMultiple]
    let search = [DCVXETypes.selectSearch]
    if (multiple.includes(this.$type)) {
      // 处理多选
      let props = this.originColumn.props || {}
      props['mode'] = 'multiple'
      props['maxTagCount'] = 1
      this.$set(this.originColumn, 'props', props)
    } else if (search.includes(this.$type)) {
      // 处理搜索
      this.$set(this.originColumn, 'allowSearch', true)
    }
  },
  methods: {
    handleChange(value) {
      this.handleChangeCommon(value)
    },

    /** 处理blur失去焦点事件 */
    handleBlur(value) {
      let { allowInput, options } = this.originColumn

      if (allowInput === true) {
        // 删除无用的因搜索（用户输入）而创建的项
        if (typeof value === 'string') {
          let indexes = []
          options.forEach((option, index) => {
            if (option.value.toLocaleString() === value.toLocaleString()) {
              delete option.searchAdd
            } else if (option.searchAdd === true) {
              indexes.push(index)
            }
          })
          // 翻转删除数组中的项
          for (let index of indexes.reverse()) {
            options.splice(index, 1)
          }
        }
      }

      this.handleBlurCommon(value)
    },

    /** 用于搜索下拉框中的内容 */
    handleSelectFilterOption(input, option) {
      let { allowSearch, allowInput } = this.originColumn
    //   if (allowSearch === true || allowInput === true) {
    //     //update-begin-author:taoyan date:20200820 for:【专项任务】大连项目反馈行编辑问题处理 下拉框搜索
    //     return option.componentOptions.children[0].children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    //     //update-end-author:taoyan date:20200820 for:【专项任务】大连项目反馈行编辑问题处理 下拉框搜索
    //   }
      return true
    },

    /** select 搜索时的事件，用于动态添加options */
    handleSearchSelect(value) {
      let { allowSearch, allowInput, options } = this.originColumn

      if (allowSearch !== true && allowInput === true) {
        // 是否找到了对应的项，找不到则添加这一项
        let flag = false
        for (let option of options) {
          if (option.value.toLocaleString() === value.toLocaleString()) {
            flag = true
            break
          }
        }
        // !!value ：不添加空值
        if (!flag && !!value) {
          // searchAdd 是否是通过搜索添加的
          options.push({ title: value, value: value, searchAdd: true })
        }
      }
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
