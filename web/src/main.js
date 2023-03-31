import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'

import './extends/use'
import './extends/directive'
import './extends/prototype'

import store from './store'
import router from './router'
import App from './app'
import '@/components/nprogress.less'
import '@wytxer/style-utils/lib/common.less'


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
