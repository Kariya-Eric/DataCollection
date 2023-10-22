<template>
  <div>
    <div style="margin-bottom: 8px">
      <a-button type="primary" icon="plus" @click="insertEvent" style="margin-right: 12px">新增</a-button>
      <a-popconfirm title="您确定要删除选中的数据" @confirm="removeChecked" overlayClassName="input-pop" v-if="selectedRows.length > 0">
        <a-button type="danger" class="del-action">删除</a-button>
      </a-popconfirm>
      <div style="float: right">
        <a-dropdown placement="topCenter">
          <a-button type="primary" icon="cloud-download" @click="e => e.preventDefault()">数据导出</a-button>
          <a-menu slot="overlay">
            <a-menu-item key="1" @click="exportData('xlsx')"> <a-icon type="file-excel" />导出Excel</a-menu-item>
            <a-menu-item key="2" @click="exportData('pdf')"> <a-icon type="file-pdf" />导出PDF </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </div>
    <vxe-table
      border
      auto-resize
      round
      show-overflow
      ref="xTable"
      :data="dataSource"
      :edit-config="{ trigger: 'click', mode: 'cell', showIcon: false }"
      align="center"
      size="medium"
      :import-config="importConfig"
      :export-config="exportConfig"
      :edit-rules="rules"
      @edit-closed="editClosed"
      @checkbox-all="checkboxAll"
      @checkbox-change="checkboxChange"
    >
      <vxe-column type="checkbox" width="60"></vxe-column>
      <vxe-column type="seq" width="60" title="序号"> </vxe-column>
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
              <a-select-option v-for="(item, i) in columns[index].type.__slot__.options" :key="i" :value="item.value">{{ item.label }}</a-select-option>
            </a-select>
          </template>
          <template v-if="col.component == 'date'">
            <dc-date v-model="scope.row[col.props]" :placeholder="col.placeholder" :format="columns[index].type.format" :mode="columns[index].type.mode" />
          </template>
        </template>
        <template #default="{ row }" v-if="col.component == 'select'">{{ getLabel(row[col.props], columns[index].type) }}</template>
      </vxe-column>
      <vxe-column title="操作" width="120">
        <template #default="{ row }">
          <a-popconfirm @confirm="deleteRow(row)" title="您确定要删除选中的数据" overlayClassName="input-pop">
            <a class="del-action"><span style="color: red">删除</span></a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script>
export default {
  name: 'FormTable',
  props: ['columns', 'value', 'required'],
  data() {
    return {
      dataSource: this.value,
      selectedRows: [],
      importConfig: { types: ['xlsx'] },
      exportConfig: { types: ['xlsx', 'pdf'] }
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
        if (column.type.__config__.label == '单行文本' || column.type.__config__.label == '多行文本') {
          if (column.type.allowChar) {
            ruleList.push({
              pattern: /^[^\u4E00-\u9FA5]+$/,
              message: `${column.label}中不能包含汉字`,
              trigger: 'change'
            })
          }
        } else if (column.type.__config__.label == '链接') {
          ruleList.push({
            pattern: /^[^\u4E00-\u9FA5]+$/,
            message: `${column.label}中不能包含汉字`,
            trigger: 'change'
          })
        } else if (column.type.__config__.label == '邮箱') {
          ruleList.push({
            pattern: /\w[-.\w]*@[-a-z0-9]+(\.[-a-z0-9]+)*\.(com|cn)/,
            message: '请输入正确的邮箱',
            trigger: 'change'
          })
        } else if (column.type.__config__.label == '电话') {
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
        if (column.type.__config__.label == '单行文本') {
          component = 'input'
          autofocus = '.ant-input'
        } else if (column.type.__config__.label == '多行文本') {
          component = 'textarea'
          autofocus = '.ant-input'
        } else if (column.type.__config__.label == '数字') {
          component = 'number'
          autofocus = '.ant-input-number-input'
        } else if (column.type.__config__.label == '链接') {
          component = 'link'
          autofocus = '.ant-input'
        } else if (column.type.__config__.label == '邮箱') {
          component = 'mail'
          autofocus = '.ant-input'
        } else if (column.type.__config__.label == '电话') {
          component = 'phone'
          autofocus = '.ant-input'
        } else if (column.type.__config__.label == '地址') {
          component = 'address'
          autofocus = '.ant-input'
        } else if (column.type.__config__.label == '下拉选择') {
          component = 'select'
          autofocus = '.ant-select-search__field'
        } else if (column.type.__config__.label == '日期选择') {
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
        const item = type.__slot__.options.find(item => item[valueProp] === value)
        return item ? item[labelField] : null
      } else {
        if (!value || value.length == 0) {
          return null
        } else {
          return value
            .map(val => {
              const item = type.__slot__.options.find(item => item[valueProp] === val)
              return item ? item[labelField] : null
            })
            .join(', ')
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
      this.$refs.xTable.removeCheckboxRow()
      this.selectedRows = []
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
      const newRecord = {}
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

    async validate() {
      const $table = this.$refs.xTable
      $table.clearCheckboxRow()
      const errMap = await $table.validate(true).catch(errMap => errMap)
      if (errMap) {
        return undefined
      } else {
        $table.clearEdit()
        this.$emit('input', $table.getTableData().tableData)
        return $table.getTableData().tableData
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
