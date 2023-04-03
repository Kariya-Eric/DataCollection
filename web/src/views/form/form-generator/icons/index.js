import Vue from 'vue'
import FormSvgIcon from '../components/FormSvgIcon'// svg component

// register globally
Vue.component('form-svg-icon', FormSvgIcon)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
