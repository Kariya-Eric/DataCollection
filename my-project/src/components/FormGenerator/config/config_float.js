// 浮动表单配置文件
import { input } from './config_common'

export const otherComponentsFloat = [
  {
    __config__: {
      tagIcon: 'icon-dc_table',
      layout: 'tableLayout',
      label: '表格',
      tag: 'floatTable',
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
