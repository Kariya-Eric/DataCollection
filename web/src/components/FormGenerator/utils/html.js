import { formConf } from "./config";
// import { getDrawingList } from "../utils/db";
import { isNumberStr } from "../utils";
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
  const margin = scheme.formAlert === "" ? "" : `style="margin-top:24px"`;
  let str = `<el-form ${margin} ref="${scheme.formRef}" :model="${
    scheme.formModel
  }" :rules="${scheme.formRules}" size="${scheme.size}" label-width="${
    scheme.labelWidth
  }px" ${labelPosition}>
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

function buildFromBtns() {
  let str = `<el-col><el-form-item size="small">
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item></el-col>`;
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

function vif(scheme) {
  let vif = "";
  formConf.componentsVisible.forEach((vis) => {
    vis.hiddenList.forEach((hide) => {
      if (hide == scheme.__config__.formId) {
        vis.termList.forEach((term) => {
          let formId = term.termOption.split(",")[0];
          getDrawingList().forEach((item) => {
            if (item.__config__.formId == formId) {
              let termValueInput = isNumberStr(term.termValueInput)
                ? `${term.termValueInput}`
                : `'${term.termValueInput}'`;
              if (term.equalTerm === 0) {
                vif +=
                  vis.equalTerm === "or"
                    ? `${formConf.formModel}.${item.__vModel__}==${termValueInput}||`
                    : `${formConf.formModel}.${item.__vModel__}==${termValueInput}&&`;
              } else if (term.equalTerm === 1) {
                vif +=
                  vis.equalTerm === "or"
                    ? `${formConf.formModel}.${item.__vModel__}!=${termValueInput}||`
                    : `${formConf.formModel}.${item.__vModel__}!=${termValueInput}&&`;
              } else if (term.equalTerm === 4) {
                vif +=
                  vis.equalTerm === "or"
                    ? `${formConf.formModel}.${item.__vModel__}>${termValueInput}||`
                    : `${formConf.formModel}.${item.__vModel__}>${termValueInput}&&`;
              } else if (term.equalTerm === 5) {
                vif +=
                  vis.equalTerm === "or"
                    ? `${formConf.formModel}.${item.__vModel__}<${termValueInput}||`
                    : `${formConf.formModel}.${item.__vModel__}<${termValueInput}&&`;
              } else if (term.equalTerm === 2) {
                term.termValueOption.forEach((val) => {
                  let termVal = isNumberStr(val) ? `${val}` : `'${val}'`;
                  vif += `${formConf.formModel}.${item.__vModel__}==${termVal}||`;
                });
                if (vis.equalTerm === "or") {
                  vif = vif.substring(0, vif.length - 2) + "||";
                } else {
                  vif = vif.substring(0, vif.length - 2) + "&&";
                }
              } else if (term.equalTerm === 3) {
                term.termValueOption.forEach((val) => {
                  let termVal = isNumberStr(val) ? `${val}` : `'${val}'`;
                  vif += `${formConf.formModel}.${item.__vModel__}!=${termVal}&&`;
                });
                if (vis.equalTerm === "or") {
                  vif = vif.substring(0, vif.length - 2) + "||";
                } else {
                  vif = vif.substring(0, vif.length - 2) + "&&";
                }
              }
            }
          });
        });
      }
    });
  });
  let str = "";
  if (vif !== "") {
    vif = vif.substring(0, vif.length - 2);
    str = `v-if="${vif}"`;
  }
  return str;
}

function labelTooltip(scheme) {
  const comment = scheme.comment;
  if (comment === "") {
    return "";
  } else {
    const str = `<span slot="label">
      <el-tooltip style="margin:4px" effect="dark" content="${comment}" placement="bottom">
        <i class="el-icon-question" />
      </el-tooltip>
      <span>${scheme.__config__.label}</span>
    </span>`;
    return str;
  }
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
    const hide = vif(scheme);
    const tooltip = labelTooltip(scheme);
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    let str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${hide}>
          ${tooltip}${tagDom}
      </el-form-item>`;
    return colWrapper(scheme, str);
  },
  customItem(scheme) {
    const config = scheme.__config__;
    const hide = vif(scheme);
    const tagDom = tags[config.tag] ? tags[config.tag](scheme, hide) : null;
    let str = `<el-col>${tagDom}</el-col>`;
    return str;
  },
  customTable(scheme) {
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
    const hide = vif(scheme);
    const tooltip = labelTooltip(scheme);
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null;
    let str = `<el-form-item ${labelWidth} ${label} prop="${scheme.__vModel__}" ${hide}>
          ${tooltip}${tagDom}
      </el-form-item>`;
    return colWrapper(scheme, str);
  },
};

const tags = {
  "el-input": (el) => {
    const { tag, vModel, clearable, placeholder, width } = attrBuilder(el);
    const type = el.type ? `type="${el.type}"` : "";
    return `<${tag} ${vModel} ${type} ${placeholder} ${clearable} ${width}></${tag}>`;
  },
  "el-select": (el) => {
    const { tag, vModel, clearable, placeholder, width } = attrBuilder(el);
    const filterable = el.filterable ? "filterable" : "";
    const multiple = el.multiple ? "multiple" : "";
    let child = buildElSelectChild(el);

    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${placeholder} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`;
  },
  "el-radio-group": (el) => {
    const { tag, vModel } = attrBuilder(el);
    let child = buildElRadioGroupChild(el);
    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel}>${child}</${tag}>`;
  },
  "el-checkbox-group": (el) => {
    const { tag, vModel } = attrBuilder(el);
    const min = el.min ? `:min="${el.min}"` : "";
    const max = el.max ? `:max="${el.max}"` : "";
    let child = buildElCheckboxGroupChild(el);
    if (child) child = `\n${child}\n`; // 换行
    return `<${tag} ${vModel} ${min} ${max}>${child}</${tag}>`;
  },
  "el-date-picker": (el) => {
    const { tag, vModel, clearable, placeholder, width } = attrBuilder(el);
    const format = el.format ? `format="${el.format}"` : "";
    const valueFormat = el["value-format"]
      ? `value-format="${el["value-format"]}"`
      : "";
    const type = el.type ? `type=${el.type}` : `type="date"`;
    return `<${tag} ${type} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${clearable} ></${tag}>`;
  },
  // ============自定义组件=============================
  customDivider: (el, hide) => {
    const title = `title="${el.title}"`;
    const titlePosition = `titlePosition="${el.titlePosition}"`;
    const fontSize = `:fontSize="${el.fontSize}"`;
    const letterSpacing = `:letterSpacing="${el.letterSpacing}"`;
    const color = `color="${el.color}"`;
    return `<custom-divider ${title} ${titlePosition} ${fontSize} ${letterSpacing} ${color} ${hide}/>`;
  },
  customPhone: (el) => {
    const { vModel, placeholder, width } = attrBuilder(el);
    const isMobile = `:isMobile="${el.isMobile}"`;
    return `<custom-phone ${vModel} ${placeholder} ${width} ${isMobile} />`;
  },
  customLink: (el) => {
    const { vModel, placeholder, width } = attrBuilder(el);
    return `<custom-link ${vModel} ${placeholder} ${width}  />`;
  },
  customMail: (el) => {
    const { vModel, placeholder, width } = attrBuilder(el);
    return `<custom-mail ${vModel} ${placeholder} ${width} />`;
  },
  customNumber: (el) => {
    const { vModel, placeholder, width } = attrBuilder(el);
    const precision = `:precision="${el.precision}"`;
    const min = el.min ? `:min="${el.min}"` : "";
    const max = el.max ? `:max="${el.max}"` : "";
    return `<custom-number ${vModel} ${placeholder} ${precision} ${max} ${min} ${width}/>`;
  },
  customAddress: (el) => {
    const { vModel, placeholder, width } = attrBuilder(el);
    return `<custom-address ${vModel} ${placeholder} ${width} />`;
  },
  customEditTable: (el) => {
    const ref = `ref='customTable_${el.__config__.formId}'`;
    const columns = `:columns='${JSON.stringify(el.columns)}'`;
    const dataSource = `v-model="${confGlobal.formModel}.${el.__vModel__}"`;
    const required = `:required="${el.__config__.required}"`;
    return `<render-table ${ref} ${columns} ${dataSource} ${required}/>`;
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
      `<el-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.label" :value="item.value"></el-option>`
    );
  }
  return children.join("\n");
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    const tag = "el-radio";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value" >{{item.label}}</${tag}>`
    );
  }
  return children.join("\n");
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = [];
  const slot = scheme.__slot__;
  if (slot && slot.options && slot.options.length) {
    const tag = "el-checkbox";
    children.push(
      `<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :label="item.value">{{item.label}}</${tag}>`
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
  formConf.componentsVisible = formConfig.componentsVisible;
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
  const alert =
    formConfig.formAlert === ""
      ? ""
      : `<el-alert title="填报提示" type="warning" :closable="false">${formConfig.formAlert}</el-alert>`;
  const str = `<div>${alert}${temp}</div>`;
  return str;
}
