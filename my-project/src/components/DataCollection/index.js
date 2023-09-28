import DcSwitch from './DcSwitch'
import DcDate from './DcDate'
export default {
  install(Vue) {
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
  }
}
