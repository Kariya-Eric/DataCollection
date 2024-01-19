// 固定表单配置文件
import { input, textarea, number, link, mail, phone, select, date, address } from './config_common'

// 输入型组件 【左面板】
export const inputComponentsFix = [input, textarea, number, link, mail, phone]

// 选择型组件 【左面板】
export const selectComponentsFix = [
  select,
  date,
  address,
  {
    __config__: {
      label: '单项选择',
      changeTag: true,
      showLabel: true,
      tag: 'a-radio-group',
      tagIcon: 'icon-dc_radio',
      layout: 'colFormItem',
      span: 24,
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      defaultValue: undefined,
      required: true
    },
    __slot__: {
      options: [
        {
          label: '选项一',
          value: '选项一'
        },
        {
          label: '选项二',
          value: '选项二'
        }
      ]
    },
    source:false, //下拉选项值是手动设置or来源，source true为来源
    comment: ''
  },
  {
    __config__: {
      label: '多项选择',
      tag: 'a-checkbox-group',
      changeTag: true,
      tagIcon: 'icon-dc_checkbox',
      defaultValue: [],
      span: 24,
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      showLabel: true,
      layout: 'colFormItem',
      required: true
    },
    __slot__: {
      options: [
        {
          label: '选项一',
          value: '选项一'
        },
        {
          label: '选项二',
          value: '选项二'
        }
      ]
    },
    source:false, //下拉选项值是手动设置or来源，source true为来源
    comment: ''
  }
]

export const otherComponentsFix = [
  {
    __config__: {
      tagIcon: 'icon-dc_table',
      layout: 'tableLayout',
      label: '表格',
      tag: 'fixedTable',
      showLabel: true,
      span: 24,
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      required: true
    },
    selectedCol: -1,
    columns: [
      {
        key: 1,
        label: '列1',
        props: '',
        type: input
      },
      {
        key: 2,
        label: '列2',
        props: '',
        type: input
      },
      {
        key: 3,
        label: '列3',
        props: '',
        type: input
      }
    ],
    comment: ''
  }
]

// 布局型组件 【左面板】
export const layoutComponentsFix = [
  {
    __config__: {
      tag: 'formDivider',
      tagIcon: 'icon-dc_divider',
      label: '分割线',
      layout: 'colFormItem',
      showLabel: false,
      labelCol: { span: 0 },
      wrapperCol: { span: 24 }
    },
    orientation: 'left',
    title: '标题',
    fontSize: 16
  }
]
