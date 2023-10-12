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
      tagIcon: '单项选择',
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
          value: 1
        },
        {
          label: '选项二',
          value: 2
        }
      ]
    },
    comment: ''
  },
  {
    __config__: {
      label: '多项选择',
      tag: 'a-checkbox-group',
      changeTag: true,
      tagIcon: '多项选择',
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
          value: 1
        },
        {
          label: '选项二',
          value: 2
        }
      ]
    },
    comment: ''
  }
]

export const otherComponentsFix = [
  {
    __config__: {
      tagIcon: '表格',
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
        props: 'col1',
        type: input
      },
      {
        key: 2,
        label: '列2',
        props: 'col2',
        type: input
      },
      {
        key: 3,
        label: '列3',
        props: 'col3',
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
      tagIcon: '分割线',
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
