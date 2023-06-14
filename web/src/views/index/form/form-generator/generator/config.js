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
  formAlert: "",
  formBtns: true,
  componentsVisible: []
};

// 输入型组件 【左面板】
export const inputComponents = [
  {
    // 组件的自定义配置
    __config__: {
      label: "单行文本",
      changeTag: true,
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
    comment: "",
    allowChar: false,
  },
  {
    __config__: {
      label: "多行文本",
      changeTag: true,
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
    style: { width: "100%" },
    comment: "",
    allowChar: false,
  },
  {
    __config__: {
      label: "数字",
      changeTag: true,
      showLabel: true,
      tag: "customNumber",
      defaultValue: undefined,
      tagIcon: "number",
      required: true,
      layout: "colFormItem",
      span: 24,
    },
    style: { width: "100%" },
    placeholder: "请输入",
    precision: 0,
    min: undefined,
    max: undefined,
    comment: "",
  },
  {
    __config__: {
      label: "链接",
      changeTag: true,
      showLabel: true,
      tag: "customLink",
      defaultValue: undefined,
      tagIcon: "link",
      required: true,
      layout: "colFormItem",
      span: 24,
    },
    style: { width: "100%" },
    placeholder: "请输入",
    comment: "",
  },
  {
    __config__: {
      label: "邮箱",
      changeTag: true,
      showLabel: true,
      defaultValue: undefined,
      tag: "customMail",
      tagIcon: "mail",
      required: true,
      layout: "colFormItem",
      span: 24,
    },
    style: { width: "100%" },
    placeholder: "请输入",
    comment: "",
  },
  {
    __config__: {
      label: "电话",
      changeTag: true,
      showLabel: true,
      defaultValue: undefined,
      tag: "customPhone",
      tagIcon: "smartphone",
      required: true,
      layout: "colFormItem",
      span: 24,
    },
    isMobile: false,
    style: { width: "100%" },
    placeholder: "请输入",
    comment: "",
  },
];

// 选择型组件 【左面板】
export const selectComponents = [
  {
    __config__: {
      label: "下拉选择",
      changeTag: true,
      showLabel: true,
      tag: "el-select",
      tagIcon: "select",
      layout: "colFormItem",
      span: 24,
      defaultValue: undefined,
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
    filterable: false,
    multiple: false,
    comment: "",
  },
  {
    __config__: {
      label: "单选框组",
      changeTag: true,
      showLabel: true,
      tag: "el-radio-group",
      tagIcon: "radio",
      layout: "colFormItem",
      span: 24,
      defaultValue: undefined,
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
    comment: "",
  },
  {
    __config__: {
      label: "多选框组",
      tag: "el-checkbox-group",
      changeTag: true,
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
    comment: "",
  },
  {
    __config__: {
      label: "日期选择",
      tag: "el-date-picker",
      changeTag: true,
      tagIcon: "date",
      showLabel: true,
      layout: "colFormItem",
      required: true,
      span: 24,
      defaultValue: undefined,
    },
    placeholder: "请选择",
    style: { width: "100%" },
    type: "month",
    clearable: true,
    format: "yyyy-MM",
    "value-format": "yyyy-MM",
    comment: "",
  },
  {
    __config__: {
      label: "地址",
      changeTag: true,
      showLabel: true,
      tag: "customAddress",
      tagIcon: "address",
      required: true,
      layout: "colFormItem",
      span: 24,
    },
    style: { width: "100%" },
    placeholder: "请输入",
    comment: "",
  },
];

export const otherComponents = [
  {
    __config__: {
      tagIcon: "table_1",
      layout: "customTable",
      label: "表格",
      tag: "customEditTable",
      showLabel: true,
      span: 24,
      required: true,
    },
    row: 1,
    col: 3,
    selectedCol: -1,
    comment: "",
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
        allowChar: false,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM",
        "value-format": "yyyy-MM",
        dateType: "month",
        comment: '',
        filterable: false,
        multiple: false,
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
        allowChar: false,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM",
        "value-format": "yyyy-MM",
        dateType: "month",
        comment: '',
        filterable: false,
        multiple: false,
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
        allowChar: false,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM",
        "value-format": "yyyy-MM",
        dateType: "month",
        comment: '',
        filterable: false,
        multiple: false,
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

