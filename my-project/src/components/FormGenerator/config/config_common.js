//通用组件
export const input = {
  __config__: {
    label: '单行文本',
    changeTag: true,
    showLabel: true,
    tag: 'a-input',
    tagIcon: 'icon-dc_input',
    defaultValue: undefined,
    required: true,
    layout: 'colFormItem',
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    span: 24
  },
  placeholder: '请输入',
  style: { width: '100%' },
  comment: '',
  allowChar: false
}

export const textarea = {
  __config__: {
    label: '多行文本',
    changeTag: true,
    showLabel: true,
    tag: 'a-textarea',
    tagIcon: 'icon-dc_textarea',
    defaultValue: undefined,
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    required: true,
    layout: 'colFormItem',
    span: 24
  },
  placeholder: '请输入',
  style: { width: '100%' },
  comment: '',
  style: { width: '100%' },
  allowChar: false
}

export const number = {
  __config__: {
    label: '数字',
    changeTag: true,
    showLabel: true,
    tag: 'a-input-number',
    defaultValue: undefined,
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    tagIcon: 'icon-dc_array',
    required: true,
    layout: 'colFormItem',
    span: 24
  },
  placeholder: '请输入',
  precision: 0,
  min: undefined,
  max: undefined,
  style: { width: '100%' },
  comment: ''
}

export const link = {
  __config__: {
    label: '链接',
    changeTag: true,
    showLabel: true,
    tag: 'formLink',
    defaultValue: undefined,
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    tagIcon: 'icon-dc_link',
    required: true,
    layout: 'colFormItem',
    span: 24
  },
  placeholder: '请输入',
  style: { width: '100%' },
  comment: ''
}

export const mail = {
  __config__: {
    label: '邮箱',
    changeTag: true,
    showLabel: true,
    defaultValue: undefined,
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    tag: 'formMail',
    tagIcon: 'icon-dc_email',
    required: true,
    layout: 'colFormItem',
    span: 24
  },
  placeholder: '请输入',
  style: { width: '100%' },
  comment: ''
}

export const phone = {
  __config__: {
    label: '电话',
    changeTag: true,
    showLabel: true,
    defaultValue: undefined,
    tag: 'formPhone',
    tagIcon: 'icon-dc_phone',
    required: true,
    layout: 'colFormItem',
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    span: 24
  },
  isMobile: false,
  placeholder: '请输入',
  style: { width: '100%' },
  comment: ''
}

export const select = {
  __config__: {
    label: '下拉选择',
    changeTag: true,
    showLabel: true,
    tag: 'a-select',
    tagIcon: 'icon-dc_select',
    layout: 'colFormItem',
    span: 24,
    defaultValue: undefined,
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
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
  source: undefined, //下拉选项值是手动设置or来源，source true为来源
  placeholder: '请选择',
  showSearch: false,
  mode: 'default',
  style: { width: '100%' },
  comment: ''
}

export const date = {
  __config__: {
    label: '日期选择',
    tag: 'dc-date',
    changeTag: true,
    tagIcon: 'icon-dc_datetime',
    showLabel: true,
    layout: 'colFormItem',
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    required: true,
    span: 24,
    defaultValue: undefined
  },
  placeholder: '请选择',
  mode: 'month',
  format: 'yyyy-MM',
  style: { width: '100%' },
  comment: ''
}

export const address = {
  __config__: {
    label: '地址',
    changeTag: true,
    showLabel: true,
    tag: 'formAddress',
    tagIcon: 'icon-dc_address',
    required: true,
    layout: 'colFormItem',
    labelCol: { span: 2 },
    wrapperCol: { span: 22 },
    span: 24
  },
  style: { width: '100%' },
  placeholder: '请输入',
  type: '省（直辖市、自治区）/市/区-详细地址',
  comment: ''
}
