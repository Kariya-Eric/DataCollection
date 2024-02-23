<template>
  <div>
    <div class="seach-wrapper" v-if="!fixed">
      <a-row :gutter="12">
        <a-col :md="3" :sm="12">
          <dc-select v-model="searchParam.props" placeholder="全部" :options="columns" :fields="{ label: 'label', value: 'props' }"></dc-select>
        </a-col>
        <a-col :md="5" :sm="12">
          <a-input v-model="searchParam.value" placeholder="请输入" />
        </a-col>
        <a-col :md="3" :sm="12">
          <a-button type="primary" @click="searchEvent">搜索</a-button>
        </a-col>
      </a-row>
    </div>
    <div style="margin-bottom: 8px" v-if="!disabled && fixed">
      <a-button type="primary" icon="plus" @click="insertEvent" style="margin-right: 12px">添加</a-button>
      <a-popconfirm title="确定要删除选中的数据" @confirm="removeChecked" overlayClassName="input-pop" v-if="selectedRows.length > 0" okText="确定" cancelText="取消">
        <a-button type="danger">删除</a-button>
      </a-popconfirm>
      <a-popconfirm title="确定要清空数据吗" @confirm="clearAll" overlayClassName="input-pop" okText="确定" cancelText="取消">
        <a-button type="primary" style="margin-left: 12px">清空数据</a-button>
      </a-popconfirm>
      <!-- <div style="float: right">
        <a-dropdown placement="topCenter">
          <a-button type="primary" icon="cloud-download" @click="exportData('xlsx')">数据导出</a-button>
        </a-dropdown>
      </div> -->
    </div>
    <div style="margin-bottom: 8px" v-if="!disabled && !fixed">
      <span>总数 : {{ count }}</span>
      <div style="float: right">
        <a-button type="primary" icon="plus" @click="insertEvent" style="margin-right: 12px">添加</a-button>
        <a-popconfirm title="确定要删除选中的数据" @confirm="removeChecked" overlayClassName="input-pop" v-if="selectedRows.length > 0" okText="确定" cancelText="取消">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
        <a-popconfirm title="确定要清空数据吗" @confirm="clearAll" overlayClassName="input-pop" okText="确定" cancelText="取消">
          <a-button type="primary" style="margin-left: 12px">清空数据</a-button>
        </a-popconfirm>
      </div>
    </div>
    <vxe-table
      border
      auto-resize
      round
      show-overflow
      ref="xTable"
      :data="tempDatasource"
      :edit-config="{ trigger: disabled ? 'manual' : 'click', mode: 'cell', showIcon: false }"
      align="center"
      size="medium"
      :import-config="importConfig"
      :export-config="exportConfig"
      :edit-rules="rules"
      @edit-closed="editClosed"
      @checkbox-all="checkboxAll"
      @checkbox-change="checkboxChange"
    >
      <vxe-column type="checkbox" width="60" v-if="!disabled"></vxe-column>
      <vxe-column width="60" title="序号" type="seq"> </vxe-column>
      <vxe-column v-for="(col, index) in renderColumns" :key="col.key" :field="col.props" :title="col.label" :min-width="220" :edit-render="{ autofocus: col.autofocus }">
        <template #header="{ column }">
          <a-tooltip placement="bottom" v-if="col.comment.length > 0">
            <template slot="title">{{ col.comment }}</template>
            <dc-icon type="icon-dc_tooltip" style="margin: 0px 4px" />
          </a-tooltip>
          <span>{{ column.title }}</span>
        </template>
        <template #edit="scope">
          <template v-if="col.component == 'input'"><a-input v-model="scope.row[col.props]" :placeholder="col.placeholder" /></template>
          <template v-if="col.component == 'textarea'"> <form-textarea v-model="scope.row[col.props]" :placeholder="col.placeholder" /></template>
          <template v-if="col.component == 'address'"> <form-address-pop v-model="scope.row[col.props]" :placeholder="col.placeholder" /></template>
          <template v-if="col.component == 'number'">
            <a-input-number
              v-model="scope.row[col.props]"
              :placeholder="col.placeholder"
              :min="columns[index].type.min"
              :max="columns[index].type.max"
              :precision="columns[index].type.precision"
            />
          </template>
          <template v-if="col.component == 'link'"><form-link v-model="scope.row[col.props]" :placeholder="col.placeholder" /></template>
          <template v-if="col.component == 'mail'"> <form-mail v-model="scope.row[col.props]" :placeholder="col.placeholder" /></template>
          <template v-if="col.component == 'phone'"><form-phone v-model="scope.row[col.props]" :placeholder="col.placeholder" :isMobile="columns[index].type.isMobile" /></template>
          <template v-if="col.component == 'select'">
            <a-select
              v-model="scope.row[col.props]"
              :showSearch="columns[index].type.showSearch"
              :mode="columns[index].type.mode"
              :filterOption="(inputValue, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0"
            >
              <a-select-option v-for="(item, i) in columns[index].type.__slot__.options" :key="i" :value="item.label">{{ item.label }}</a-select-option>
            </a-select>
          </template>
          <template v-if="col.component == 'date'">
            <dc-date v-model="scope.row[col.props]" :placeholder="col.placeholder" :format="columns[index].type.format" :mode="columns[index].type.mode" />
          </template>
        </template>
        <template #default="{ row }" v-if="col.component == 'select'">{{ getLabel(row[col.props], columns[index].type) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="120" v-if="!disabled">
        <template #default="{ row }">
          <a-popconfirm @confirm="deleteRow(row)" title="您确定要删除选中的数据" overlayClassName="input-pop" okText="确定" cancelText="取消">
            <a class="del-action"><span style="color: red">删除</span></a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script>
import XEUtils from 'xe-utils'
import { nanoid } from 'nanoid'
export default {
  name: 'FormTable',
  props: ['columns', 'value', 'required', 'disabled', 'fixed'],
  data() {
    return {
      searchParam: {},
      tempDatasource: [],
      dataSource: this.value,
      selectedRows: [],
      importConfig: { types: ['xlsx'] },
      exportConfig: { types: ['xlsx'] },
      count: 0
    }
  },
  watch: {
    value: {
      handler(newVal) {
        this.count = newVal.length
        this.dataSource = newVal
        this.$nextTick(() => this.searchEvent())
      },
      immediate: true
    }
  },
  computed: {
    rules() {
      let rule = {}
      this.columns.map(column => {
        let ruleList = []
        if (column.type.__config__.required) {
          ruleList.push({
            required: true,
            message: `${column.label}为必输项！`,
            trigger: 'change'
          })
        }
        if (column.type.__config__.tag == 'a-input' || column.type.__config__.tag == 'a-textarea') {
          if (column.type.allowChar) {
            ruleList.push({
              pattern: /^[^\u4E00-\u9FA5]+$/,
              message: `${column.label}中不能包含汉字`,
              trigger: 'change'
            })
          }
        } else if (column.type.__config__.tag == 'formLink') {
          ruleList.push({
            pattern: /^[^\u4E00-\u9FA5]+$/,
            message: `${column.label}中不能包含汉字`,
            trigger: 'change'
          })
        } else if (column.type.__config__.tag == 'formMail') {
          ruleList.push({
            pattern: /\w[-.\w]*@[-a-z0-9]+(\.[-a-z0-9]+)*\.(com|cn)/,
            message: '请输入正确的邮箱',
            trigger: 'change'
          })
        } else if (column.type.__config__.tag == 'formPhone') {
          if (column.type.isMobile) {
            ruleList.push({
              pattern: /^(\+\d{2}-)?0\d{2,3}-\d{7,8}$/,
              message: '请输入正确的电话号码',
              trigger: 'change'
            })
          } else {
            ruleList.push({
              pattern: /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/,
              message: '请输入正确的手机号',
              trigger: 'change'
            })
          }
        }
        if (ruleList.length != 0) {
          rule[column.props] = ruleList
        }
      })
      return rule
    },

    renderColumns() {
      return this.columns.map(column => {
        let component
        let autofocus
        if (column.type.__config__.tag == 'a-input') {
          component = 'input'
          autofocus = '.ant-input'
        } else if (column.type.__config__.tag == 'a-textarea') {
          component = 'textarea'
          autofocus = '.ant-input'
        } else if (column.type.__config__.tag == 'a-input-number') {
          component = 'number'
          autofocus = '.ant-input-number-input'
        } else if (column.type.__config__.tag == 'formLink') {
          component = 'link'
          autofocus = '.ant-input'
        } else if (column.type.__config__.tag == 'formMail') {
          component = 'mail'
          autofocus = '.ant-input'
        } else if (column.type.__config__.tag == 'formPhone') {
          component = 'phone'
          autofocus = '.ant-input'
        } else if (column.type.__config__.tag == 'formAddress') {
          component = 'address'
          autofocus = '.ant-input'
        } else if (column.type.__config__.tag == 'a-select') {
          component = 'select'
          autofocus = '.ant-select-search__field'
        } else if (column.type.__config__.tag == 'dc-date') {
          component = 'date'
          autofocus = '.ant-calendar-picker-input'
        } else {
          component = ''
          autofocus = ''
        }
        let { key, label, props } = column
        let placeholder = column.type.placeholder
        let comment = column.type.comment
        return {
          key,
          label,
          props,
          component,
          comment,
          placeholder,
          autofocus
        }
      })
    }
  },

  methods: {
    exportData(type) {
      const $table = this.$refs.xTable
      if ($table) {
        $table.exportData({ filename: '导出', sheetName: 'Sheet1', type })
      }
    },

    // 处理多选择的回显
    getLabel(value, type, valueProp = 'value', labelField = 'label') {
      if (type.mode === 'default') {
        const item = type.__slot__.options.find(item => item[labelField] === value)
        return item ? item[labelField] : null
      } else {
        if (!value || value.length == 0) {
          return null
        } else {
          if (value instanceof Array) {
            return value
              .map(val => {
                const item = type.__slot__.options.find(item => item[labelField] === val)
                return item ? item[labelField] : null
              })
              .join(',')
          } else {
            return value
          }
        }
      }
    },
    checkboxAll() {
      const $table = this.$refs.xTable
      this.selectedRows = $table.getCheckboxRecords()
    },
    checkboxChange() {
      const $table = this.$refs.xTable
      this.selectedRows = $table.getCheckboxRecords()
    },

    async removeChecked() {
      const $table = this.$refs.xTable
      $table.removeCheckboxRow()
      this.selectedRows = []
      this.$emit('input', $table.getTableData().tableData)
    },

    async deleteRow(row) {
      if (this.selectedRows.includes(row)) {
        this.selectedRows = this.selectedRows.filter(item => item != row)
      }
      const $table = this.$refs.xTable
      await $table.remove(row)
      this.$emit('input', $table.getTableData().tableData)
    },

    async insertEvent() {
      const $table = this.$refs.xTable
      // const errMap = await $table.validate().catch(errMap => errMap)
      // if (errMap) {
      //   return
      // }
      const newRecord = { _X_ROW_KEY: nanoid() }
      this.columns.forEach(col => {
        if (col.type.__config__.label == '下拉选择' && col.type.mode == 'multiple') {
          newRecord[col.props] = []
        } else {
          newRecord[col.props] = undefined
        }
      })
      await $table.insertAt(newRecord, -1)
    },

    async editClosed() {
      this.$emit('resetTable')
    },

    async clearAll() {
      const xTable = this.$refs.xTable
      xTable.remove()
      this.selectedRows = []
      this.$emit('input', xTable.getTableData().tableData)
    },

    searchEvent() {
      //全表搜索
      const filterName = XEUtils.toValueString(this.searchParam.value).trim().toLowerCase()
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi')
        const searchProps = this.searchParam.props ? [this.searchParam.props] : this.columns.map(col => col.props)
        const rest = this.dataSource.filter(item =>
          searchProps.some(
            key =>
              XEUtils.toValueString(item[key] instanceof Array ? item[key].join(',') : item[key])
                .toLowerCase()
                .indexOf(filterName) > -1
          )
        )
        this.tempDatasource = rest.map(row => {
          const item = Object.assign({}, row)
          searchProps.forEach(key => {
            item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `${match}`)
          })
          return item
        })
      } else {
        this.tempDatasource = this.dataSource
      }
    },

    async validate() {
      const $table = this.$refs.xTable
      $table.clearCheckboxRow()
      const errMap = await $table.fullValidate().catch(errMap => errMap)
      if (errMap) {
        $table.clearEdit()
        const msgList = {}
        Object.values(errMap).forEach(errList => {
          errList.forEach(params => {
            const { column, rules, row } = params
            let rowIndex = -1
            $table.getTableData().tableData.find((item, index) => {
              if (item._X_ROW_KEY === row._X_ROW_KEY) {
                rowIndex = index
                return item
              }
              return undefined
            })
            rules.forEach(rule => {
              if (!msgList[rowIndex + 1]) {
                msgList[rowIndex + 1] = []
              }
              msgList[rowIndex + 1].push(`${column.title}!^${rule.message}`)
            })
          })
        })
        return msgList
      } else {
        $table.clearEdit()
        this.$emit('input', $table.getTableData().tableData)
        return $table.getTableData().tableData
      }
    }
  }
}
</script>

<style lang="less">
.vxe-checkbox:not(.is--disabled):hover .vxe-checkbox--icon,
.vxe-custom--checkbox-option:not(.is--disabled):hover .vxe-checkbox--icon,
.vxe-export--panel-column-option:not(.is--disabled):hover .vxe-checkbox--icon,
.vxe-table--filter-option:not(.is--disabled):hover .vxe-checkbox--icon,
.vxe-table--render-default .vxe-cell--checkbox:not(.is--disabled):hover .vxe-checkbox--icon {
  color: #2f68bd !important;
}
.is--checked.vxe-checkbox,
.is--checked.vxe-checkbox .vxe-checkbox--icon,
.is--checked.vxe-custom--checkbox-option,
.is--checked.vxe-custom--checkbox-option .vxe-checkbox--icon,
.is--checked.vxe-export--panel-column-option,
.is--checked.vxe-export--panel-column-option .vxe-checkbox--icon,
.is--checked.vxe-table--filter-option,
.is--checked.vxe-table--filter-option .vxe-checkbox--icon,
.is--indeterminate.vxe-checkbox,
.is--indeterminate.vxe-checkbox .vxe-checkbox--icon,
.is--indeterminate.vxe-custom--checkbox-option,
.is--indeterminate.vxe-custom--checkbox-option .vxe-checkbox--icon,
.is--indeterminate.vxe-export--panel-column-option,
.is--indeterminate.vxe-export--panel-column-option .vxe-checkbox--icon,
.is--indeterminate.vxe-table--filter-option,
.is--indeterminate.vxe-table--filter-option .vxe-checkbox--icon,
.vxe-table--render-default .is--checked.vxe-cell--checkbox,
.vxe-table--render-default .is--checked.vxe-cell--checkbox .vxe-checkbox--icon,
.vxe-table--render-default .is--indeterminate.vxe-cell--checkbox,
.vxe-table--render-default .is--indeterminate.vxe-cell--checkbox .vxe-checkbox--icon {
  color: #2f68bd !important;
}
.keyword-lighten {
  color: #000;
  background-color: #ffff00;
}
</style>
