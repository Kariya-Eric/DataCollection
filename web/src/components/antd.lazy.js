import {
  Button,
  Input,
  InputNumber,
  Radio,
  Switch,
  Checkbox,
  Select,
  Icon,
  Badge,
  Breadcrumb,
  Menu,
  DatePicker,
  Dropdown,
  Popconfirm,
  TimePicker,
  Progress,
  Tree,
  TreeSelect,
  Pagination,
  notification,
  Modal
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less';

export default {
  install(Vue) {
    Vue.component('AButton', Button)
    Vue.component('AInput', Input)
    Vue.component('AInputNumber', InputNumber)
    Vue.component('ARadio', Radio)
    Vue.component('ASwitch', Switch)
    Vue.component('ACheckbox', Checkbox)
    Vue.component('ASelect', Select)
    Vue.component('AIcon', Icon)
    Vue.component('ABadge', Badge)
    Vue.component('ABreadcrumb', Breadcrumb)
    Vue.component('AMenu', Menu)
    Vue.component('ADatePicker', DatePicker)
    Vue.component('ATimePicker', TimePicker)
    Vue.component('AProgress', Progress)
    Vue.component('APopconfirm', Popconfirm)
    Vue.component('ATree', Tree)
    Vue.component('ADropdown', Dropdown)
    Vue.component('ATreeSelect', TreeSelect)
    Vue.component('APagination', Pagination)
    Vue.component('ASelectOption', Select.Option)
    Vue.component('AMenuItem', Menu.Item)
    Vue.component('AMenuDivider', Menu.Divider)
    Vue.use(Modal)
    Vue.prototype.$notification = notification
    Vue.prototype.$DCModal = Modal
  }
}
