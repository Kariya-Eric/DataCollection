import DcSwitch from './DataCollection/DcSwitch'
import DcDate from './DataCollection/DcDate'
import DcModal from './DataCollection/DcModal.vue'
import FormGenerator from './FormGenerator'
import Tinymce from './Tinymce'
import CustomComponents from './FormGenerator/layouts'
import VueAreaLinkage from 'vue-area-linkage'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
import VXETablePluginExportPDF from 'vxe-table-plugin-export-pdf'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
export default {
  install(Vue) {
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
    Vue.component('DcModal', DcModal)
    Vue.component('FormGenerator', FormGenerator)
    Vue.component('tinymce', Tinymce)
    Vue.use(CustomComponents)
    Vue.use(VueAreaLinkage)
    Vue.use(VXETable)
    VXETable.use(VXETablePluginAntd)
    VXETable.use(VXETablePluginExportXLSX)
    VXETable.use(VXETablePluginExportPDF)
  }
}
