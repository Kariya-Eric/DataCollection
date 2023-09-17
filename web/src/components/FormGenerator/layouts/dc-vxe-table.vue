<template>
  <div>
    <dc-vxe-table toolbar keep-source :dataSource="dataSource" :columns="renderColumns"> </dc-vxe-table>
  </div>
</template>

<script>
import { DCVXETypes } from '@/components/DCVxeTable'
export default {
  name: 'DCVxeTable',
  props: ['columns', 'value', 'required'],
  data() {
    return {
      dataSource: this.value
    }
  },
  computed: {
    renderColumns() {
      let renderCols = []
      columns.forEach(column => {
        let { label, props } = column
        let placeholder = column.type.placeholder
        let comment = column.type.comment
        let col = { title: label, key: props, align: 'center', placeholder }
        if (comment) {
          col.titleHelp = { message: comment }
        }
        if (column.type.__config__.label == '单行文本') {
          col.type = DCVXETypes.input
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '多行文本') {
          col.type = DCVXETypes.textarea
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '数字') {
          col.type = DCVXETypes.inputNumber
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '链接') {
          col.type = DCVXETypes.inputLink
          co
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '邮箱') {
          col.type = DCVXETypes.inputMail
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '电话') {
          col.type = DCVXETypes.inputPhone
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '地址') {
        } else if (column.type.__config__.label == '下拉选择') {
          col.type = DCVXETypes.input
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else if (column.type.__config__.label == '日期选择') {
          col.type = DCVXETypes.input
          if (column.type.__config__.required) {
            col.validateRules = [{ required: true, message: '请输入${title}' }]
          }
        } else {
        }
      })
      return renderCols
    }
  },

  methods: {}
}
</script>

<style scoped lang="scss"></style>
