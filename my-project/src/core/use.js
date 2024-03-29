import Vue from 'vue'

import Element from 'element-ui'
import './element-variables.scss'

Vue.use(Element)

// base library
import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import VueCropper from 'vue-cropper'
import 'ant-design-vue/dist/antd.less'

// ext library
import VueClipboard from 'vue-clipboard2'
import './directives/action'

VueClipboard.config.autoSetContainer = true

Vue.use(Antd)
Vue.use(Viser)
Vue.use(VueClipboard)
Vue.use(VueCropper)

process.env.NODE_ENV !== 'production' && console.warn('[antd-pro] WARNING: Antd now use fulled imported.')

import DcComponents from '@/components'

Vue.use(DcComponents)

import { DcIcon } from './icon'
Vue.component('dcIcon', DcIcon)
