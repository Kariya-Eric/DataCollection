import DcSwitch from './DataCollection/DcSwitch'
import DcDate from './DataCollection/DcDate'
import DcModal from './DataCollection/DcModal.vue'
import DcInputPop from './DataCollection/DcInputPop.vue'
import FormGenerator from './FormGenerator'
import Tinymce from './Tinymce'
import './DataCollection/VxeTable/install'
export default {
  install(Vue) {
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
    Vue.component('DcModal', DcModal)
    Vue.component('FormGenerator', FormGenerator)
    Vue.component('DcInputPop', DcInputPop)
    Vue.component('tinymce', Tinymce)
  }
}
