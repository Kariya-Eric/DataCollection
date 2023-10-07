import DcSwitch from './DataCollection/DcSwitch'
import DcDate from './DataCollection/DcDate'
import FormGenerator from './FormGenerator'
export default {
  install(Vue) {
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
    Vue.component('FormGenerator', FormGenerator)
  }
}
