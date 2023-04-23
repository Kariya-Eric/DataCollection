/* eslint-disable max-len */
import ruleTrigger from "./ruleTrigger";

let confGlobal;
let someSpanIsNot24;

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`;
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`;
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`;
}

function buildFormTemplate(scheme, child) {
  let labelPosition = "";
  if (scheme.labelPosition !== "right") {
    labelPosition = `label-position="${scheme.labelPosition}"`;
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : "";
  let str = `<el-form ref="${scheme.formRef}" :model="${
    scheme.formModel
  }" :rules="${scheme.formRules}" size="${
    scheme.size
  }" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}>
      ${child}
      ${buildFromBtns(scheme)}
    </el-form>`;
  if (someSpanIsNot24) {
    str = `<el-row :gutter="${scheme.gutter}">
        ${str}
      </el-row>`;
  }
  return str;
}

function buildFromBtns(scheme) {
  let str = "";
  if (scheme.formBtns) {
    str = `<el-form-item size="small">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>`;
    if (someSpanIsNot24) {
      str = `<el-col :span="24">
          ${str}
        </el-col>`;
    }
  }
  return str;
}

// span不为24的用el-col包裹
function colWrapper(scheme, str) {
  if (someSpanIsNot24 || scheme.__config__.span !== 24) {
    return `<el-col :span="${scheme.__config__.span}">
      ${str}
    </el-col>`;
  }
  return str;
}

const layouts = {
  colFormItem(scheme) {
    const config = scheme.__config__;
    let labelWidth = "";
    let label = `label="${config.label}"`;
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`;
    }
    if (config.showLabel === false) {
      labelWidth = 'label-width="0"';
      label = "";
    }
    const required =
      !ruleTrigger[config.tag] && config.required ? "required" : "";
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    let str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${required}>
        ${tagDom}
      </el-form-item>`;
    return colWrapper(scheme, str);
  },
  customItem(scheme) {
    const config = scheme.__config__;
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    let str = `${tagDom}`;
    return str;
  },
};

const tags = {
  "el-input": (el) => {
    const { tag, disabled, vModel, clearable, placeholder, width } =
      attrBuilder(el);
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : "";
    const showWordLimit = el["show-word-limit"] ? "show-word-limit" : "";
    const readonly = el.readonly ? "readonly" : "";
    const type = el.type ? `type="${el.type}"` : "";
    const autosize =
      el.autosize && el.autosize.minRows
        ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
        : "";
    return `<${tag} ${vModel} ${type} ${placeholder} ${maxlength} ${showWordLimit} ${readonly} ${disabled} ${clearable} ${autosize} ${width}></${tag}>`;
  },
  "el-select": (el) => {
    const { tag, disabled, vModel, clearable, placeholder, width } =
      attrBuilder(el);
    const filterable = el.filterable ? "filterable" : "";
    const multiple = el.multiple ? "multiple" : "";
    let child = buildElSelectChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`;
  },
  "el-radio-group": (el) => {
    const { tag, disabled, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    let child = buildElRadioGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-checkbox-group": (el) => {
    const { tag, disabled, vModel } = attrBuilder(el);
    const size = `size="${el.size}"`;
    const min = el.min ? `:min="${el.min}"` : "";
    const max = el.max ? `:max="${el.max}"` : "";
    let child = buildElCheckboxGroupChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${min} ${max} ${size} ${disabled}>${child}</${tag}>`;
  },
  "el-time-picker": (el) => {
    const { tag, disabled, vModel, clearable, placeholder, width } =
      attrBuilder(el);
    const startPlaceholder = el["start-placeholder"]
      ? `start-placeholder="${el["start-placeholder"]}"`
      : "";
    const endPlaceholder = el["end-placeholder"]
      ? `end-placeholder="${el["end-placeholder"]}"`
      : "";
    const rangeSeparator = el["range-separator"]
      ? `range-separator="${el["range-separator"]}"`
      : "";
    const isRange = el["is-range"] ? "is-range" : "";
    const format = el.format ? `format="${el.format}"` : "";
    const valueFormat = el["value-format"]
      ? `value-format="${el["value-format"]}"`
      : "";
    const pickerOptions = el["picker-options"]
      ? `:picker-options='${JSON.stringify(el["picker-options"])}'`
      : "";

    return `<${tag} ${vModel} ${isRange} ${format} ${valueFormat} ${pickerOptions} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${disabled}></${tag}>`;
  },
  "el-date-picker": (el) => {
    const { tag, disabled, vModel, clearable, placeholder, width } =
      attrBuilder(el);
    const startPlaceholder = el["start-placeholder"]
      ? `start-placeholder="${el["start-placeholder"]}"`
      : "";
    const endPlaceholder = el["end-placeholder"]
      ? `end-placeholder="${el["end-placeholder"]}"`
      : "";
    const rangeSeparator = el["range-separator"]
      ? `range-separator="${el["range-separator"]}"`
      : "";
    const format = el.format ? `format="${el.format}"` : "";
    const valueFormat = el["value-format"]
      ? `value-format="${el["value-format"]}"`
      : "";
    const type = el.type === "date" ? "" : `type="${el.type}"`;
    const readonly = el.readonly ? "readonly" : "";

    return `<${tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${tag}>`;
  },
  // ============自定义组件=============================
  customDivider: (el) => {
    const title = `title="${el.title}"`;
    const titlePosition = `titlePosition="${el.titlePosition}"`;
    const fontSize = `:fontSize="${el.fontSize}"`;
    const letterSpacing = `:letterSpacing="${el.letterSpacing}"`;
    const color = `color="${el.color}"`;
    return `<custom-divider ${title} ${titlePosition} ${fontSize} ${letterSpacing} ${color} />`;
  },
  customPhone: (el) => {
    const { disabled, vModel, placeholder, width } = attrBuilder(el);
    const readonly = el.readonly ? "readonly" : "";
    return `<custom-phone ${vModel} ${placeholder} ${readonly} ${disabled} ${width} />`;
  },
  customMail: (el) => {
    const { disabled, vModel, placeholder, width } = attrBuilder(el);
    const readonly = el.readonly ? "readonly" : "";
    return `<custom-mail ${vModel} ${placeholder} ${readonly} ${disabled} ${width} />`;
  },
  customEditTable: (el) => {
    const columns = el.columns;
    let str = "";
    for (let i = 0; i < columns.length; i++) {
      str += `<el-table-column label="${columns[i].label}" prop="${columns.props}" align="center">
        <template slot-scope="scope">
            <el-input size="small"/>
        </template>
    </el-table-column>`;
    }
    const dataSource = el.dataSource;
    return `<el-table size="small" :border="true">
        <el-table-column type="selection" width="55" align="center" />
            ${str}
        <el-table-column label="操作" align="center">
            <template slot-scope="scope">
                
            </template>
        </el-table-column>
    </el-table>`;
  },
  // ============自定义组件=============================
};

function attrBuilder(el) {
  return {
    tag: el.__config__.tag,
    vModel: `v-model="${confGlobal.formModel}.${el.__vModel__}"`,
    clearable: el.clearable ? "clearable" : "",
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : "",
    // width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
    width:
      el.style && el.style.width ? `:style="{width: '${el.style.width}'}"` : "",
    disabled: el.disabled ? ":disabled='true'" : "",
  };
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    children.push(
      `<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value" :disabled="item.disabled"></el-option>`
    );
  }
  return children.join("\n");
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    const tag = config.optionType === "button" ? "el-radio-button" : "el-radio";
    const border = config.border ? "border" : "";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`
    );
  }
  return children.join("\n");
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  const config = scheme.__config__;
  if (slot && slot.options && slot.options.length) {
    const tag =
      config.optionType === "button" ? "el-checkbox-button" : "el-checkbox";
    const border = config.border ? "border" : "";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" :disabled="item.disabled" ${border}>{{item.label}}</${tag}>`
    );
  }
  return children.join("\n");
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig) {
  const htmlList = [];
  confGlobal = formConfig;
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some(
    (item) => item.__config__.span !== 24
  );
  // 遍历渲染每个组件成html
  formConfig.fields.forEach((el) => {
    htmlList.push(layouts[el.__config__.layout](el));
  });
  const htmlStr = htmlList.join("\n");
  // 将组件代码放进form标签
  let temp = buildFormTemplate(formConfig, htmlStr);
  confGlobal = null;
  return temp;
}
