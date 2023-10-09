import { buildRules } from './vif'
import ruleTrigger from './ruleTrigger'

let confGlobal
let someSpanIsNot24

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`
}

function buildFormTemplate(scheme, child) {
  let labelCol = ''
  let wrapperCol = ''
  let labelAlign = ''
  if (scheme.labelCol && (!scheme.layout || scheme.layout === 'horizontal')) {
    labelCol = `:label-col="{ span: ${scheme.labelCol.span},
      offset: ${scheme.labelCol.offset ? scheme.labelCol.offset : 0} }" `
  }
  if (scheme.wrapperCol && (!scheme.layout || scheme.layout === 'horizontal')) {
    wrapperCol = `:wrapper-col="{ span: ${scheme.wrapperCol.span},
      offset: ${scheme.wrapperCol.offset ? scheme.wrapperCol.offset : 0} }"`
  }
  if (scheme.labelAlign && scheme.labelAlign !== 'right') {
    labelAlign = `label-align="${scheme.labelAlign}"`
  }
  const margin = scheme.formAlert === '' ? '' : `style="margin-top:24px"`
  let str = `<a-form-model ${margin} ref="${scheme.formRef}" :model="${scheme.formModel}" :rules="${scheme.formRules}"  ${labelCol} ${wrapperCol} ${labelAlign}>
      ${child}
    </a-form-model>`
  if (someSpanIsNot24) {
    str = `<a-row :gutter="${scheme.gutter}">
        ${str}
      </a-row>`
  }
  return str
}

// span不为24的用el-col包裹
function colWrapper(scheme, str) {
  if (someSpanIsNot24 || scheme.__config__.span !== 24) {
    return `<a-col :span="${scheme.__config__.span}">
      ${str}
    </a-col>`
  }
  return str
}

function labelTooltip(scheme) {
  if (scheme.__config__.tag == 'formDivider') {
    return ''
  }
  const comment = scheme.comment
  if (comment === '') {
    return ''
  } else {
    const str = `<span slot="label">
      <a-tooltip style="margin:4px" content="${comment}" placement="bottom">
        <template slot="title"><span>${scheme.__config__.label}</span></template>
        <a-icon type="question-circle" />
      </a-tooltip>
    </span>`
    return str
  }
}

const layouts = {
  colFormItem(scheme) {
    const vif = buildRules(confGlobal, scheme)
    const config = scheme.__config__
    let labelCol = ''
    let wrapperCol = ''
    let labelAlign = ''
    let label = `label="${config.label}"`
    if (config.labelCol && (!config.layout || scheme.layout === 'horizontal')) {
      labelCol = `:label-col="{ span: ${config.labelCol.span},
        offset: ${config.labelCol.offset ? config.labelCol.offset : 0} }" `
    }
    if (config.wrapperCol && (!config.layout || scheme.layout === 'horizontal')) {
      wrapperCol = `:wrapper-col="{ span: ${config.wrapperCol.span},
        offset: ${config.wrapperCol.offset ? config.wrapperCol.offset : 0} }"`
    }
    if (config.showLabel === false) {
      label = ''
    }
    if (config.labelAlign && config.labelAlign !== 'right') {
      labelAlign = `:label-align="${config.labelAlign}"`
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    const tooltip = labelTooltip(scheme)
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
    let str = `<a-form-model-item ${labelCol} ${wrapperCol} ${labelAlign} ${label} ${vif} prop="${scheme.__vModel__}" ${required}>
          ${tooltip}${tagDom}
      </a-form-model-item>`
    return colWrapper(scheme, str)
  },

  tableLayout(scheme) {
    const vif = buildRules(confGlobal, scheme)
    const config = scheme.__config__
    let labelCol = ''
    let wrapperCol = ''
    let labelAlign = ''
    let label = `label="${config.label}"`
    if (config.labelCol && (!config.layout || scheme.layout === 'horizontal')) {
      labelCol = `:label-col="{ span: ${config.labelCol.span},
        offset: ${config.labelCol.offset ? config.labelCol.offset : 0} }" `
    }
    if (config.wrapperCol && (!config.layout || scheme.layout === 'horizontal')) {
      wrapperCol = `:wrapper-col="{ span: ${config.wrapperCol.span},
        offset: ${config.wrapperCol.offset ? config.wrapperCol.offset : 0} }"`
    }
    if (config.showLabel === false) {
      label = ''
    }
    if (config.labelAlign && config.labelAlign !== 'right') {
      labelAlign = `:label-align="${config.labelAlign}"`
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    const tooltip = labelTooltip(scheme)
    const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
    let str = `<a-form-model-item ${labelCol} ${wrapperCol} ${labelAlign} ${label} ${vif} prop="${scheme.__vModel__}" ${required}>
          ${tooltip}${tagDom}
      </a-form-model-item>`
    return colWrapper(scheme, str)
  }
}

const tags = {
  'a-input': el => {
    const { tag, vModel, placeholder, width } = attrBuilder(el)
    return `<${tag} ${vModel} ${placeholder} ${width}></${tag}>`
  },
  'a-textarea': el => {
    const { tag, vModel, placeholder, width } = attrBuilder(el)
    return `<${tag} ${vModel} ${placeholder} ${width}></${tag}>`
  },
  'a-input-number': el => {
    const { tag, vModel, placeholder, width } = attrBuilder(el)
    const min = el.min ? `:min="${el.min}"` : ''
    const max = el.max ? `:max="${el.max}"` : ''
    const precision = `:precision="${el.precision}"`
    return `<${tag} ${vModel} ${placeholder} ${width} ${min} ${max} ${precision} />`
  },
  'a-select': el => {
    const { tag, vModel, placeholder, width } = attrBuilder(el)
    const showSearch = el.showSearch ? 'showSearch' : ''
    const multiple = `mode="${el.mode}"`
    const filterOption = `:filterOption="(inputValue, option) => option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0"`
    let child = buildElSelectChild(el)
    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} ${placeholder} ${multiple} ${showSearch} ${filterOption} ${width}>${child}</${tag}>`
  },
  'a-radio-group': el => {
    const { tag, vModel } = attrBuilder(el)
    let child = buildElRadioGroupChild(el)
    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel}>${child}</${tag}>`
  },
  'a-checkbox-group': el => {
    const { tag, vModel } = attrBuilder(el)
    let child = buildElCheckboxGroupChild(el)
    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${vModel} >${child}</${tag}>`
  },
  // ============自定义组件=============================
  'dc-date': el => {
    const { tag, vModel, placeholder, width } = attrBuilder(el)
    const format = `format="${el.format}"`
    const mode = `mode="${el.mode}"`
    return `<${tag}  ${vModel} ${format} ${mode} ${width} ${placeholder} ></${tag}>`
  },
  formDivider: el => {
    const title = `title="${el.title}"`
    const fontSize = `:fontSize="${el.fontSize}"`
    return `<form-divider ${title} ${fontSize} />`
  },
  formPhone: el => {
    const { vModel, placeholder, width } = attrBuilder(el)
    const isMobile = `:isMobile="${el.isMobile}"`
    return `<form-phone ${vModel} ${placeholder} ${width} ${isMobile} />`
  },
  formLink: el => {
    const { vModel, placeholder, width } = attrBuilder(el)
    return `<form-link ${vModel} ${placeholder} ${width}  />`
  },
  formMail: el => {
    const { vModel, placeholder, width } = attrBuilder(el)
    return `<form-mail ${vModel} ${placeholder} ${width} />`
  },
  formAddress: el => {
    const { vModel, placeholder, width } = attrBuilder(el)
    return `<form-address ${vModel} ${placeholder} ${width} />`
  },
  floatTable: el => {
    return `<div>123</div>`
  },
  fixedTable: el => {
    const { vModel } = attrBuilder(el)
    const ref = `ref='table_${el.__config__.formId}'`
    const columns = `:columns='${JSON.stringify(el.columns)}'`
    const required = `:required="${el.__config__.required}"`
    return `<form-table ${ref} ${columns} ${vModel} ${required} @add="$emit('resize')" />`
  }
  // ============自定义组件=============================
}

function attrBuilder(el) {
  return {
    tag: el.__config__.tag,
    vModel: `v-model="${confGlobal.formModel}.${el.__vModel__}"`,
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? `:style="{width: '${el.style.width}'}"` : ''
  }
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length) {
    children.push(`<a-select-option v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :value="item.value">{{item.label}}</a-select-option>`)
  }
  return children.join('\n')
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length) {
    const tag = 'a-radio'
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :value="item.value" >{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length) {
    const tag = 'a-checkbox'
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options" :key="index" :value="item.value">{{item.label}}</${tag}>`)
  }
  return children.join('\n')
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConfig) {
  const htmlList = []
  confGlobal = formConfig
  // 判断布局是否都沾满了24个栅格，以备后续简化代码结构
  someSpanIsNot24 = formConfig.fields.some(item => item.__config__.span !== 24)
  // 遍历渲染每个组件成html
  formConfig.fields.forEach(el => {
    htmlList.push(layouts[el.__config__.layout](el))
  })
  const htmlStr = htmlList.join('\n')
  // 将组件代码放进form标签
  let temp = buildFormTemplate(formConfig, htmlStr)
  confGlobal = null
  const alert = formConfig.formAlert === '' ? '' : `<a-alert message="填报提示" type="warning" show-icon description="${formConfig.formAlert}" />`
  const str = `<div>${alert}${temp}</div>`
  return str
}