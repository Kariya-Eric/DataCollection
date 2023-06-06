export default [
  {
    // 组件的自定义配置
    __config__: {
      formId: 100,
      label: "单行文本",
      showLabel: true,
      tag: "el-input",
      tagIcon: "input",
      defaultValue: undefined,
      required: true,
      layout: "colFormItem",
      span: 24,
    },
    __vModel__: "field100",
    style: { width: "100%" },
    // 其余的为可直接写在组件标签上的属性
    placeholder: "请输入单行文本",
    maxlength: null,
    readonly: false,
    disabled: false,
    comment: "",
    allowChar: true,
  },
];