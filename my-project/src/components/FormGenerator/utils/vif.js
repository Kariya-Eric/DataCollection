// 用于构建和解析组件显示隐规则
import { isNumberStr } from './index'

export function buildRules(globalFormConf, scheme) {
  const ruleList = globalFormConf.componentsVisible
  const drawingList = globalFormConf.fields
  let vif = ''
  ruleList.forEach(rule => {
    const { andOr, showList, termList } = rule
    showList.forEach(formItem => {
      if (formItem == scheme.__config__.formId) {
        termList.forEach(term => {
          drawingList.forEach(draw => {
            if (term.term == draw.__config__.formId) {
              if (term.termVal instanceof Array) {
                term.termVal.forEach(val => {
                  let value = isNumberStr(val) ? `${val}` : `'${val}'`
                  if (term.calFlag == '&&') {
                    vif += `${globalFormConf.formModel}.${draw.__vModel__}!=${value}${term.calFlag}`
                  } else {
                    vif += `${globalFormConf.formModel}.${draw.__vModel__}==${value}${term.calFlag}`
                  }
                })
                if (vif.length > 0) {
                  vif = vif.substring(0, vif.length - 2)
                }
                vif += `${andOr}`
              } else {
                let value = isNumberStr(term.termVal) ? `${term.termVal}` : `'${term.termVal}'`
                vif += `${globalFormConf.formModel}.${draw.__vModel__}${term.calFlag}${value}${andOr}`
              }
            }
          })
        })
      }
    })
  })
  if (vif.length > 0) {
    vif = vif.substring(0, vif.length - 2)
  }
  vif = vif.length > 0 ? `v-if="${vif}"` : `v-if="true"`
  return vif
}
