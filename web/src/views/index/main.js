import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import router from '@/router'
import store from '@/store'

import '@/icons' // all icons and svg-icon
import './permission' // permission control

import '@/utils/filter' // global filters
import Storage from 'vue-ls'
import config from './defaultSettings'

import Directive from '@/directive/index.js'
Vue.use(Directive)

import Components from '@/components'
Vue.use(Components)

Vue.use(ElementUI, { size: 'small' })
Vue.use(ElementUI, { locale })

Vue.use(Storage, config.storageOptions)

import '@/components/DCVxeTable/install'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
