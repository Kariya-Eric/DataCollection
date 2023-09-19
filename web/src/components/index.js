import Breadcrumb from './Breadcrumb'
import SvgIcon from './SvgIcon'
import Tinymce from './Tinymce'
import CountDown from './CountDown'
import FormGenerator from './FormGenerator'
import SelectTree from './SelectTree'
import CustomComponents from './FormGenerator/layouts'
import DCComponents from './DataCollection'
import AreaLinkage from './AreaLinkage'
import VueAreaLinkage from 'vue-area-linkage'
import data from 'china-area-data'
export default {
  install(Vue) {
    Vue.component('breadcrumb', Breadcrumb)
    Vue.component('svgIcon', SvgIcon)
    Vue.component('tinymce', Tinymce)
    Vue.component('formGenerator', FormGenerator)
    Vue.component('selectTree', SelectTree)
    Vue.component('countDown', CountDown)
    Vue.component('areaLinkage', AreaLinkage)
    Vue.use(VueAreaLinkage)
    Vue.use(CustomComponents)
    Vue.use(DCComponents)
    Vue.prototype.$pcaa = data
  }
}
