import DCDialog from './DCDialog'
import DCEllipsis from './DCEllipsis'
import DCForm from './DCForm'
import DCSearch from './DCSearch'
import DCStatistic from './DCStatistic'
import DCStatus from './DCStatus'
import DCTable from './DCTable'

export default {
  install(Vue) {
    Vue.component('dcDialog', DCDialog)
    Vue.component('dcEllipsis', DCEllipsis)
    Vue.component('dcForm', DCForm)
    Vue.component('dcSearch', DCSearch)
    Vue.component('dcStatistic', DCStatistic)
    Vue.component('dcStatus', DCStatus)
    Vue.component('dcTable', DCTable)
  }
}
