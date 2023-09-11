import Breadcrumb from './Breadcrumb'
import SvgIcon from './SvgIcon'
import Tinymce from './Tinymce'
import CountDown from './CountDown'
import FormGenerator from './FormGenerator'
import SelectTree from './SelectTree'
import CustomComponents from './FormGenerator/layouts'
import DCComponents from './DataCollection'

export default {
  install(Vue) {
    Vue.component('breadcrumb', Breadcrumb)
    Vue.component('svgIcon', SvgIcon)
    Vue.component('tinymce', Tinymce)
    Vue.component('formGenerator', FormGenerator)
    Vue.component('selectTree', SelectTree)
    Vue.component('countDown', CountDown)
    Vue.use(CustomComponents)
    Vue.use(DCComponents)
  }
}
