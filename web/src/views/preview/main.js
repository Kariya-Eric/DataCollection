import Vue from "vue";
import ElementUI from "element-ui";
import "@/styles/element-variables.scss";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

Vue.use(ElementUI, {
  locale,
});

import CustomComponent from "@/views/index/form/form-generator/custom_components";
Vue.use(CustomComponent);

const $previewApp = document.getElementById("previewApp");

window.addEventListener("message", init, false);

function init(event) {
  if (event.data.type === "refreshFrame") {
    const code = event.data.data;
    $previewApp.innerHTML = `<style>${code.css}</style><div id="app"></div>`;
    newVue(code.js, code.html);
  }
}

function newVue(main, html) {
  main = eval(`(${main})`);
  main.template = `<div style="overflow:hidden">${html}</div>`;
  new Vue({
    components: {
      child: main,
    },
    data() {
      return {
        visible: true,
      };
    },
    template: `<div style="overflow:hidden"><child/></div>`,
  }).$mount("#app");
}
