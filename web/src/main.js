import Vue from "vue";
import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import ElementUI from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css';
import "@/styles/element-variables.scss";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";

import "@/icons"; // all icons and svg-icon
import "@/permission"; // permission control
import waves from "@/directive/waves"; // Waves directive
import "@/utils/filter"; // global filters

import Storage from "vue-ls";
import config from "@/defaultSettings";

import Plugin from 'v-fit-columns';
Vue.use(Plugin);

Vue.use(ElementUI, {
  locale,
});

Vue.use(waves);

Vue.use(Storage, config.storageOptions);

Vue.config.productionTip = false;

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
