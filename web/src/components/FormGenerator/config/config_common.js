//通用组件
export const input = {
  __config__: {
    label: "单行文本",
    changeTag: true,
    showLabel: true,
    tag: "el-input",
    tagIcon: "单行文本",
    defaultValue: undefined,
    required: true,
    layout: "colFormItem",
    span: 24,
  },
  style: { width: "100%" },
  placeholder: "请输入",
  comment: "",
  allowChar: false,
};

export const textarea = {
  __config__: {
    label: "多行文本",
    changeTag: true,
    showLabel: true,
    tag: "el-input",
    tagIcon: "多行文本",
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
};

export const number = {
  __config__: {
    label: "数字",
    changeTag: true,
    showLabel: true,
    tag: "el-input-number",
    defaultValue: undefined,
    tagIcon: "数组",
    required: true,
    layout: "colFormItem",
    span: 24,
  },
  style: { width: "100%" },
  placeholder: "请输入",
  precision: 0,
  min: undefined,
  max: undefined,
  "controls-position": "right",
  comment: "",
};

export const link = {
  __config__: {
    label: "链接",
    changeTag: true,
    showLabel: true,
    tag: "formLink",
    defaultValue: undefined,
    tagIcon: "链接",
    required: true,
    layout: "colFormItem",
    span: 24,
  },
  style: { width: "100%" },
  placeholder: "请输入",
  comment: "",
};

export const mail = {
  __config__: {
    label: "邮箱",
    changeTag: true,
    showLabel: true,
    defaultValue: undefined,
    tag: "formMail",
    tagIcon: "邮箱",
    required: true,
    layout: "colFormItem",
    span: 24,
  },
  style: { width: "100%" },
  placeholder: "请输入",
  comment: "",
};

export const phone = {
  __config__: {
    label: "电话",
    changeTag: true,
    showLabel: true,
    defaultValue: undefined,
    tag: "formPhone",
    tagIcon: "手机",
    required: true,
    layout: "colFormItem",
    span: 24,
  },
  isMobile: false,
  style: { width: "100%" },
  placeholder: "请输入",
  comment: "",
};

export const select = {
  __config__: {
    label: "下拉选择",
    changeTag: true,
    showLabel: true,
    tag: "el-select",
    tagIcon: "下拉选择",
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
  filterable: true,
  multiple: false,
  comment: "",
};

export const date = {
  __config__: {
    label: "日期选择",
    tag: "el-date-picker",
    changeTag: true,
    tagIcon: "日期选择",
    showLabel: true,
    layout: "colFormItem",
    required: true,
    span: 24,
    defaultValue: undefined,
  },
  placeholder: "请选择",
  style: { width: "100%" },
  type: "month",
  format: "yyyy-MM",
  "value-format": "yyyy-MM",
  comment: "",
};

export const address = {
  __config__: {
    label: "地址",
    changeTag: true,
    showLabel: true,
    tag: "formAddress",
    tagIcon: "地址",
    required: true,
    layout: "colFormItem",
    span: 24,
  },
  style: { width: "100%" },
  placeholder: "请输入",
  type: "省（直辖市、自治区）/市/区-详细地址",
  comment: "",
};
