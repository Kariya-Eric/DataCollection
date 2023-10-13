import FormDivider from './form-divider'
import FormLink from './form-link'
import FormMail from './form-mail'
import FormPhone from './form-phone'
import FloatTable from './float-table'
import FixedTable from './fixed-table'
import FormTextarea from './form-textarea'
import FormAddress from './form-address'
import FormAddressPop from './form-address-pop'
import FormView from './form-view'
import FormTable from './form-table'
export default {
  install(Vue) {
    Vue.component('formDivider', FormDivider)
    Vue.component('formLink', FormLink)
    Vue.component('formMail', FormMail)
    Vue.component('formPhone', FormPhone)
    Vue.component('floatTable', FloatTable)
    Vue.component('fixedTable', FixedTable)
    Vue.component('formTextarea', FormTextarea)
    Vue.component('formAddress', FormAddress)
    Vue.component('formView', FormView)
    Vue.component('formTable', FormTable)
    Vue.component('formAddressPop', FormAddressPop)
  }
}
