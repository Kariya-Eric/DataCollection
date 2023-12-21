import DcSwitch from './DataCollection/DcSwitch'
import DcDate from './DataCollection/DcDate'
import DcDateAnt from './DataCollection/DcDateAnt'
import DcModal from './DataCollection/DcModal'
import DcStatus from './DataCollection/DcStatus'
import DcEndTime from './DataCollection/DcEndTime'
import FormGenerator from './FormGenerator'
import Tinymce from './Tinymce'
import CustomComponents from './FormGenerator/layouts'
import DcSelect from './DataCollection/DcSelect'
import DcTreeSelect from './DataCollection/DcTreeSelect'
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
    if (className.includes('input-pop') || className.includes('del-action')||className.includes('el-date-popover')) {
      return false
    }
  }
  return true
})

export default {
  install(Vue) {
    Vue.component('DcEndtime', DcEndTime)
    Vue.component('DcSwitch', DcSwitch)
    Vue.component('DcDate', DcDate)
    Vue.component('DcDateAnt', DcDateAnt)
    Vue.component('DcModal', DcModal)
    Vue.component('DcStatus', DcStatus)
    Vue.component('FormGenerator', FormGenerator)
    Vue.component('DcSelect', DcSelect)
    Vue.component('DcTreeSelect', DcTreeSelect)
    Vue.component('tinymce', Tinymce)
    Vue.use(CustomComponents)
    Vue.use(VXETable)
    VXETable.use(VXETablePluginAntd)
    VXETable.use(VXETablePluginExportXLSX)
    VXETable.use(VXETablePluginExportPDF)
  }
}
