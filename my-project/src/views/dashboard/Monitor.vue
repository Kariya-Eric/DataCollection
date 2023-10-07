<template>
  <div>
    <dc-vxe-table
      ref="vTable"
      toolbar
      row-number
      row-selection
      drag-sort
      keep-source
      :height="580"
      :dataSource="dataSource"
      :columns="columns"
      style="margin-top: 8px"
      @valueChange="handleValueChange"
    >
    </dc-vxe-table>
  </div>
</template>

<script>
import { DCVXETypes } from '@/components/DataCollection/VxeTable'
export default {
  name: 'Monitor',
  data() {
    return {
      columns: [
        {
          title: '不可编辑',
          key: 'normal',
          type: DCVXETypes.normal,
          width: '180px',
          fixed: 'left',
          defaultValue: 'normal-new'
        },
        {
          title: '单行文本',
          key: 'input',
          type: DCVXETypes.input,
          width: '180px',
          defaultValue: '',
          placeholder: '请输入${title}',
          validateRules: [
            {
              required: true, // 必填
              message: '请输入${title}' // 显示的文本
            },
            {
              pattern: /^[a-z|A-Z][a-z|A-Z\d_-]*$/, // 正则
              message: '${title}必须以字母开头，可包含数字、下划线、横杠'
            },
            {
              unique: true,
              message: '${title}不能重复'
            },
            {
              handler({ cellValue, row, column }, callback, target) {
                // cellValue 当前校验的值
                // callback(flag, message) 方法必须执行且只能执行一次
                //          flag = 是否通过了校验，不填写或者填写 null 代表不进行任何操作
                //          message = 提示的类型，默认使用配置的 message
                // target 行编辑的实例对象
                if (cellValue === 'abc') {
                  callback(false, '${title}不能是abc') // false = 未通过校验
                } else {
                  callback(true) // true = 通过验证
                }
              },
              message: '${title}默认提示'
            }
          ]
        },
        {
          title: '多行文本',
          key: 'textarea',
          type: DCVXETypes.textarea,
          width: '200px'
        },
        {
          title: '数字',
          key: 'number',
          type: DCVXETypes.inputNumber,
          width: '80px',
          defaultValue: 32,
          // 【统计列】sum = 求和、average = 平均值
          statistics: ['sum', 'average']
        },
        {
          title: '下拉框',
          key: 'select',
          type: DCVXETypes.select,
          width: '180px',
          // 下拉选项
          options: [
            { title: 'String', value: 'string' },
            { title: 'Integer', value: 'int' },
            { title: 'Double', value: 'double' },
            { title: 'Boolean', value: 'boolean' }
          ],
          allowInput: true,
          placeholder: '请选择'
        },
        {
          title: '下拉框_多选',
          key: 'select_multiple',
          type: DCVXETypes.selectMultiple,
          width: '205px',
          options: [
            { title: 'String', value: 'string' },
            { title: 'Integer', value: 'int' },
            { title: 'Double', value: 'double' },
            { title: 'Boolean', value: 'boolean' }
          ],
          defaultValue: ['int', 'boolean'], // 多个默认项
          // defaultValue: 'string,double,int', // 也可使用这种方式
          placeholder: '多选'
        },

        {
          title: '下拉框_搜索',
          key: 'select_search',
          type: DCVXETypes.selectSearch,
          width: '180px',
          options: [
            { title: 'String', value: 'string' },
            { title: 'Integer', value: 'int' },
            { title: 'Double', value: 'double' },
            { title: 'Boolean', value: 'boolean' }
          ]
        },
        {
          title: '日期时间',
          key: 'datetime',
          type: DCVXETypes.datetime,
          width: '200px',
          defaultValue: '2019-4-30 14:52:22',
          placeholder: '请选择'
        },
        {
          title: '操作',
          key: 'action',
          type: DCVXETypes.slot,
          fixed: 'right',
          minWidth: '100px',
          align: 'center',
          slotName: 'action'
        }
      ],
      dataSource: []
    }
  },
  methods: {
    handleValueChange(event) {
      console.log('handleValueChange.event: ', event)
    }
  }
}
</script>

<style scoped></style>
