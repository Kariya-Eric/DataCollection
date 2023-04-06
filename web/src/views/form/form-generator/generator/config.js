// 表单属性【右面板】
export const formConf = {
  formRef: "myForm",
  formModel: "formData",
  size: "medium",
  labelPosition: "right",
  labelWidth: 100,
  formRules: "rules",
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true,
};

// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: "单行文本",
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "el-input",
      tagIcon: "input",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      // 正则校验规则
      regList: [],
    },
    // 组件的插槽属性
    __slot__: {
      prepend: "",
      append: "",
    },
    // 其余的为可直接写在组件标签上的属性
    placeholder: "请输入",
    style: { width: "100%" },
    clearable: true,
    "prefix-icon": "",
    "suffix-icon": "",
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "多行文本",
      labelWidth: null,
      showLabel: true,
      tag: "el-input",
      tagIcon: "textarea",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      regList: [],
      changeTag: true,
    },
    type: "textarea",
    placeholder: "请输入",
    autosize: {
      minRows: 4,
      maxRows: 4,
    },
    style: { width: "100%" },
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "手机号",
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "el-input",
      tagIcon: "mobile",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      // 正则校验规则
      regList: [
        {
          pattern: "/^1(3|4|5|7|8|9)\\d{9}$/",
          message: "手机号格式错误",
        },
      ],
    },
    // 组件的插槽属性
    __slot__: {
      prepend: "",
      append: "",
    },
    __vModel__: "mobile",
    placeholder: "请输入手机号",
    style: { width: "100%" },
    clearable: true,
    "prefix-icon": "el-icon-mobile",
    "suffix-icon": "",
    maxlength: 11,
    "show-word-limit": true,
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "邮箱",
      labelWidth: null,
      showLabel: true,
      changeTag: true,
      tag: "el-input",
      tagIcon: "email",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      // 正则校验规则
      regList: [
        {
          pattern: "/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/",
          message: "邮箱格式错误",
        },
      ],
    },
    // 组件的插槽属性
    __slot__: {
      prepend: "",
      append: "",
    },
    __vModel__: "mobile",
    placeholder: "请输入邮箱",
    style: { width: "100%" },
    clearable: true,
    "prefix-icon": "",
    "suffix-icon": "",
    maxlength: 11,
    "show-word-limit": true,
    readonly: false,
    disabled: false,
  },
];

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: "下拉选择",
      showLabel: true,
      labelWidth: null,
      tag: "el-select",
      tagIcon: "select",
      layout: "colFormItem",
      span: 24,
      required: true,
      regList: [],
      changeTag: true,
    },
    __slot__: {
      options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    },
    placeholder: "请选择",
    style: { width: "100%" },
    clearable: true,
    disabled: false,
    filterable: false,
    multiple: false,
  },
  {
    __config__: {
      label: "单选框组",
      labelWidth: null,
      showLabel: true,
      tag: "el-radio-group",
      tagIcon: "radio",
      changeTag: true,
      defaultValue: undefined,
      layout: "colFormItem",
      span: 24,
      optionType: "default",
      regList: [],
      required: true,
      border: false,
    },
    __slot__: {
      options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    },
    style: {},
    size: "medium",
    disabled: false,
  },
  {
    __config__: {
      label: "多选框组",
      tag: "el-checkbox-group",
      tagIcon: "checkbox",
      defaultValue: [],
      span: 24,
      showLabel: true,
      labelWidth: null,
      layout: "colFormItem",
      optionType: "default",
      required: true,
      regList: [],
      changeTag: true,
      border: false,
    },
    __slot__: {
      options: [
        {
          label: "选项一",
          value: 1,
        },
        {
          label: "选项二",
          value: 2,
        },
      ],
    },
    style: {},
    size: "medium",
    min: null,
    max: null,
    disabled: false,
  },
  {
    __config__: {
      label: "日期选择",
      tag: "el-date-picker",
      tagIcon: "date",
      defaultValue: null,
      showLabel: true,
      labelWidth: null,
      span: 24,
      layout: "colFormItem",
      required: true,
      regList: [],
      changeTag: true,
    },
    placeholder: "请选择",
    type: "date",
    style: { width: "100%" },
    disabled: false,
    clearable: true,
    format: "yyyy-MM-dd",
    "value-format": "yyyy-MM-dd",
    readonly: false,
  },
  {
    __config__: {
      label: "日期范围",
      tag: "el-date-picker",
      tagIcon: "date-range",
      defaultValue: null,
      span: 24,
      showLabel: true,
      labelWidth: null,
      required: true,
      layout: "colFormItem",
      regList: [],
      changeTag: true,
    },
    style: { width: "100%" },
    type: "daterange",
    "range-separator": "至",
    "start-placeholder": "开始日期",
    "end-placeholder": "结束日期",
    disabled: false,
    clearable: true,
    format: "yyyy-MM-dd",
    "value-format": "yyyy-MM-dd",
    readonly: false,
  },
];

// 布局型组件 【左面板】
export const layoutComponents = [
  {
    __config__: {
      layout: "rowFormItem",
      tagIcon: "row",
      label: "行容器",
      layoutTree: true,
    },
    type: "default",
    justify: "start",
    align: "top",
  },
];

export const otherComponents = [
  {
    __config__: {
      tag: 'customDivider',
      tagIcon: "row",
      label: "分割线",
      layout: "customItem",
      showLabel: false,
    }
  }
]