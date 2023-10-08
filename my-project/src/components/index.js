import DcSwitch from './DataCollection/DcSwitch'
import DcDate from './DataCollection/DcDate'
import DcModal from './DataCollection/DcModal.vue'
import FormGenerator from './FormGenerator'
import Tinymce from './Tinymce'
import CustomComponents from './FormGenerator/layouts'
import VueAreaLinkage from 'vue-area-linkage'
export default {
  install(Vue) {
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
    Vue.component('DcModal', DcModal)
    Vue.component('FormGenerator', FormGenerator)
    Vue.component('tinymce', Tinymce)
    Vue.use(CustomComponents)
    Vue.use(VueAreaLinkage)
  }
}
