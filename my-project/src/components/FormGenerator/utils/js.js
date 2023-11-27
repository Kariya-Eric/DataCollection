import { exportDefault, deepClone } from '../utils/index'
import ruleTrigger from './ruleTrigger'

let confGlobal
/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig) {
  confGlobal = formConfig = deepClone(formConfig)
  const dataList = []
  const ruleList = []
  const optionsList = []
  const methodList = mixinMethod()

  formConfig.fields.forEach(el => {
    buildAttributes(el, dataList, ruleList, optionsList, methodList)
  })

  const script = buildexport(formConfig, dataList.join('\n'), ruleList.join('\n'), optionsList.join('\n'), methodList.join('\n'))
  confGlobal = null
  return script
}

// 构建组件属性
function buildAttributes(scheme, dataList, ruleList, optionsList, methodList) {
  const config = scheme.__config__
  const slot = scheme.__slot__
  buildData(scheme, dataList)
  buildRules(scheme, ruleList)

  // 特殊处理options属性
  if (scheme.options || (slot && slot.options && slot.options.length)) {
    buildOptions(scheme, optionsList)
  }

  // 构建子级组件属性
  if (config.children) {
    config.children.forEach(item => {
      buildAttributes(item, dataList, ruleList, optionsList, methodList)
    })
  }
}

// 混入处理函数
function mixinMethod() {
  const list = []
  const methods = {
    submitForm: `submitForm() {
        return new Promise((resolve)=>{
          this.$refs['${confGlobal.formRef}'].validate(valid => {
            if(!valid){
              resolve(undefined)
            }else{
              resolve(this.${confGlobal.formModel})
            }
          })
        })
      },`,
    resetTable: `resetTable(prop){
        this.$refs['${confGlobal.formRef}'].clearValidate(prop)
      },`
  }
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }

  return list
}

// 构建data
function buildData(scheme, dataList) {
  if (scheme.__vModel__ === undefined) return
  let vmodel
  if (confGlobal.data != null) {
    let field = Object.keys(confGlobal.data).find(key => key == scheme.__vModel__)
    if (field) {
      vmodel = JSON.stringify(confGlobal.data[field])
      dataList.push(`${scheme.__vModel__}: ${vmodel},`)
      return
    }
  }
  if (scheme.__config__.tag === 'a-checkbox-group') {
    vmodel = `[]`
  } else if (scheme.__config__.tag === 'a-select' && scheme.mode === 'multiple') {
    vmodel = `[]`
  } else if (scheme.__config__.layout === 'tableLayout') {
    vmodel = `[]`
  } else {
    vmodel = `undefined`
  }
  dataList.push(`${scheme.__vModel__}: ${vmodel},`)
}

// 构建校验规则
function buildRules(scheme, ruleList) {
  const config = scheme.__config__
  if (scheme.__vModel__ === undefined) return
  const rules = []
  if (ruleTrigger[config.tag]) {
    if (config.required && config.layout != 'tableLayout') {
      const type = Array.isArray(config.defaultValue) ? "type: 'array'," : ''
      let message = Array.isArray(config.defaultValue) ? `请至少选择一个${config.label}` : scheme.placeholder
      if (message === undefined) message = `${config.label}不能为空`
      rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`)
    }
    if (config.tag === 'a-input' || config.tag === 'a-textarea') {
      if (scheme.allowChar) {
        rules.push(`{ pattern: /^[^\\u4E00-\\u9FA5]+$/, message : '${config.label}中不能包含汉字' , trigger : '${ruleTrigger[config.tag]}' }`)
      }
    }
    if (config.tag === 'formLink') {
      rules.push(`{ pattern: /^[^\\u4E00-\\u9FA5]+$/, message : '请输入正确的${config.label}' , trigger : '${ruleTrigger[config.tag]}' }`)
    }
    if (config.tag === 'formPhone') {
      if (scheme.isMobile) {
        rules.push(`{ pattern: /^(\\+\\d{2}-)?0\\d{2,3}-\\d{7,8}$/ , message : '请输入正确的电话号码' , trigger : '${ruleTrigger[config.tag]}' }`)
      } else {
        rules.push(`{ pattern:  /^(\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})$/ , message : '请输入正确的手机号' , trigger : '${ruleTrigger[config.tag]}' }`)
      }
    }
    if (config.tag === 'formMail') {
      rules.push(`{ type: 'email' , message : '请输入正确的邮箱' , trigger : '${ruleTrigger[config.tag]}' }`)
    }
    if (config.layout === 'tableLayout') {
      rules.push(`{ validator : async (rule,value,callback) => {
        let result=await this.$refs.table_${config.formId}.validate();
        if(typeof result==='string'){
            callback(new Error(result));
        }
        if(${config.required}&&result.length==0){
          callback(new Error("请至少输入一条数据！"));
        }
        callback();
      }}`)
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(',')}],`)
  }
}

// 构建options
function buildOptions(scheme, optionsList) {
  if (scheme.__vModel__ === undefined) return
  let { options } = scheme
  if (!options) options = scheme.__slot__.options
  const str = `${scheme.__vModel__}Options: ${JSON.stringify(options)},`
  optionsList.push(str)
}

// js整体拼接
function buildexport(conf, data, rules, selectOptions, methods) {
  const str = `${exportDefault}{
  data () {
    return {
      ${conf.formModel}: {
        ${data}
      },
      ${conf.formRules}: {
        ${rules}
      },
      ${selectOptions}
    }
  },
  methods: {
    ${methods}
  }
}`
  return str
}
