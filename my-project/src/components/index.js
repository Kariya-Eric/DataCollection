import DcSwitch from './DataCollection/DcSwitch'
import DcDate from './DataCollection/DcDate'
import DcModal from './DataCollection/DcModal.vue'
import FormGenerator from './FormGenerator'
import Tinymce from './Tinymce'
import CustomComponents from './FormGenerator/layouts'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
import VXETablePluginExportPDF from 'vxe-table-plugin-export-pdf'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import { getEventPath } from '@/utils/util'

VXETable.interceptor.add('event.clearActived', function ({ column, $event }) {
  let path = getEventPath($event)
  for (let p of path) {
    let className = p.className || ''
    className = typeof className === 'string' ? className : className.toString()
    if (className.includes('input-pop') || className.includes('del-action')) {
      return false
    }
  }
  return true
})

export default {
  install(Vue) {
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
    Vue.component('DcModal', DcModal)
    Vue.component('FormGenerator', FormGenerator)
    Vue.component('tinymce', Tinymce)
    Vue.use(CustomComponents)
    Vue.use(VXETable)
    VXETable.use(VXETablePluginAntd)
    VXETable.use(VXETablePluginExportXLSX)
    VXETable.use(VXETablePluginExportPDF)
  }
}
