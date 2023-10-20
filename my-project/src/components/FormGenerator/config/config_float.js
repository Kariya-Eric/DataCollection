// 浮动表单配置文件
import { input } from './config_common'

export const otherComponentsFloat = [
  {
    __config__: {
      tagIcon: 'icon-table',
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
