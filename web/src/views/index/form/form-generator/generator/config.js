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
    },
    style: { width: "100%" },
    // 其余的为可直接写在组件标签上的属性
    placeholder: "请输入",
    maxlength: null,
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
    },
    type: "textarea",
    placeholder: "请输入",
    autosize: {
      minRows: 4,
      maxRows: 4,
    },
    style: { width: "100%" },
    maxlength: null,
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "数字",
      showLabel: true,
      tag: "customNumber",
      tagIcon: "number",
      required: true,
      layout: "colFormItem",
      defaultValue: null,
      span: 24,
    },
    style: { width: "100%" },
    placeholder: "请输入",
    disabled: false,
    precision: 0,
    min: undefined,
    max: undefined,
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
    },
    style: { width: "100%" },
    placeholder: "请输入",
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "电话",
      showLabel: true,
      tag: "customPhone",
      tagIcon: "smartphone",
      required: true,
      layout: "colFormItem",
      defaultValue: null,
      span: 24,
    },
    isMobile: false,
    style: { width: "100%" },
    placeholder: "请输入",
    readonly: false,
    disabled: false,
  },
  {
    __config__: {
      label: "地址",
      showLabel: true,
      tag: "customAddress",
      tagIcon: "smartphone",
      required: true,
      layout: "colFormItem",
      defaultValue: null,
      span: 24,
    },
    style: { width: "100%" },
    placeholder: "请输入",
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
      tag: "el-select",
      tagIcon: "select",
      layout: "colFormItem",
      span: 24,
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
      label: "日期选择",
      tag: "el-date-picker",
      tagIcon: "date",
      defaultValue: null,
      showLabel: true,
      layout: "colFormItem",
      required: true,
      span: 24,
    },
    placeholder: "请选择",
    style: { width: "100%" },
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
      layout: "customTable",
      label: "固定表格",
      tag: "customEditTable",
      showLabel: true,
      span: 24,
    },
    row: 1,
    col: 3,
    selectedCol: -1,
    columns: [
      {
        label: "列1",
        props: "col1",
        type: "input",
        required: true,
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
        minRows: 2,
        maxRows: 4,
        maxlength: null,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM-dd",
        "value-format": "yyyy-MM-dd",
      },
      {
        label: "列2",
        props: "col2",
        type: "input",
        required: true,
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
        minRows: 2,
        maxRows: 4,
        maxlength: null,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM-dd",
        "value-format": "yyyy-MM-dd",
      },
      {
        label: "列3",
        props: "col3",
        type: "input",
        required: true,
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
        minRows: 2,
        maxRows: 4,
        maxlength: null,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM-dd",
        "value-format": "yyyy-MM-dd",
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
    fontSize: 16,
  },
];

//用于控制组件是否展示
export const componentsVisible = []