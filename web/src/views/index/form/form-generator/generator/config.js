// 表单属性【右面板】
export const formConf = {
  formRef: "myForm",
  formModel: "formData",
  size: "medium",
  labelPosition: "right",
  labelWidth: 120,
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
      showLabel: true,
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
    style: { width: "100%" },
    // 其余的为可直接写在组件标签上的属性
    placeholder: "请输入",
    clearable: true,
    maxlength: null,
    "show-word-limit": false,
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "多行文本",
      showLabel: true,
      tag: "el-input",
      tagIcon: "textarea",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
      regList: [],
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
      showLabel: true,
      tag: "customPhone",
      tagIcon: "smartphone",
      required: true,
      layout: "colFormItem",
      defaultValue: null,
      span: 24,
      // 正则校验规则
      regList: [
        {
          pattern: "/^1(3|4|5|7|8|9)\\d{9}$/",
          message: "手机号格式错误",
        },
      ],
    },
    style: { width: "100%" },
    placeholder: "请输入",
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "邮箱",
      showLabel: true,
      tag: "customMail",
      tagIcon: "mail",
      required: true,
      layout: "colFormItem",
      defaultValue: null,
      span: 24,
      // 正则校验规则
      regList: [
        {
          pattern: "/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/",
          message: "邮箱格式错误",
        },
      ],
    },
    value: "",
    style: { width: "100%" },
    placeholder: "请输入",
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "计数器",
      showLabel: true,
      tag: "el-input-number",
      tagIcon: "number",
      defaultValue: undefined,
      span: 24,
      layout: "colFormItem",
      required: true,
      regList: [],
    },
    placeholder: "",
    min: undefined,
    max: undefined,
    step: 1,
    "step-strictly": false,
    precision: undefined,
    "controls-position": "",
    disabled: false,
  },
];

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: "下拉选择",
      showLabel: true,
      tag: "el-select",
      tagIcon: "select",
      layout: "colFormItem",
      span: 24,
      required: true,
      regList: [],
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
      showLabel: true,
      tag: "el-radio-group",
      tagIcon: "radio",
      defaultValue: undefined,
      layout: "colFormItem",
      span: 24,
      regList: [],
      required: true,
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
      layout: "colFormItem",
      required: true,
      regList: [],
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
    min: null,
    max: null,
    disabled: false,
  },
  {
    __config__: {
      label: "开关",
      tag: "el-switch",
      tagIcon: "switch",
      defaultValue: false,
      span: 24,
      showLabel: true,
      layout: "colFormItem",
      required: true,
      regList: [],
    },
    disabled: false,
    "active-text": "",
    "inactive-text": "",
    "active-color": null,
    "inactive-color": null,
    "active-value": true,
    "inactive-value": false,
  },
  {
    __config__: {
      label: "日期选择",
      tag: "el-date-picker",
      tagIcon: "date",
      defaultValue: null,
      showLabel: true,
      span: 24,
      layout: "colFormItem",
      required: true,
      regList: [],
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
      required: true,
      layout: "colFormItem",
      regList: [],
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

export const otherComponents = [
  {
    __config__: {
      tagIcon: "table_1",
      layout: "customItem",
      label: "固定表格",
      tag: "customEditTable",
    },
    row: 1,
    col: 3,
    selectedCol: -1,
    dataSource: [],
    on: {
      selectCol: "setSelectCol",
    },
    columns: [
      {
        index: 1,
        label: "列1",
        props: "col1",
      },
      {
        index: 2,
        label: "列2",
        props: "col2",
      },
      {
        index: 3,
        label: "列3",
        props: "col3",
      },
    ],
  },
];

// 布局型组件 【左面板】
export const layoutComponents = [
  {
    __config__: {
      tag: "customDivider",
      tagIcon: "divide",
      label: "分割线",
      layout: "customItem",
    },
    title: "标题",
    titlePosition: "left",
    fontSize: 14,
    letterSpacing: 0.2,
    color: "#000",
  },
  {
    __config__: {
      layout: "rowFormItem",
      tagIcon: "row",
      label: "行容器",
      gutter: 0,
      layoutTree: true,
    },
    children: [],
  },
];
