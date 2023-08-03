// 用于构建和解析组件显示隐规则
import { isNumberStr } from "./index";

export function buildRules(ruleList, scheme, globalForm, drawingList) {
    let vif = ""
    ruleList.forEach(rule => {
        const { andOr, showList, termList } = rule
        showList.forEach(formItem => {
            if (formItem == scheme.__config__.formId) {
                termList.forEach(term => {
                    drawingList.forEach(draw => {
                        if (term.term == draw.__config__.formId) {
                            if (term.termVal instanceof Array) {
                                term.terVal.forEach(val => {
                                    let value = isNumberStr(val) ? `${val}` : `'${val}'`
                                    if (term.calFlag == '&&') {
                                        vif += `${globalForm.formModel}.${draw.__vModel__}!=${value}${term.calFlag}`
                                    } else {
                                        vif += `${globalForm.formModel}.${draw.__vModel__}==${value}${term.calFlag}`
                                    }
                                })
                                vif += `${andOr}`
                            } else {
                                let value = isNumberStr(term.termVal) ? `${term.termVal}` : `'${term.termVal}'`
                                vif += `${globalForm.formModel}.${draw.__vModel__}${term.calFlag}${value}${andOr}`
                            }
                        }
                    })
                })
            }
        })
    })
    console.log(vif)
}