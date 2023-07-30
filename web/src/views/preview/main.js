import Vue from "vue";
import ElementUI from "element-ui";
import "@/styles/element-ui.scss";
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
  if (event.data.type === "resetForm") {
    this.vm.$refs.child.resetForm();
  }
  if (event.data.type === "submitForm") {
    this.vm.$refs.child.submitForm().then((res) => {
      if (res != undefined) {
        parent.getMessageFromFrame(res);
      }
    });
  }
}

function newVue(main, html) {
  main = eval(`(${main})`);
  main.template = `<div style="overflow-y:auto">${html}</div>`;
  const vm = new Vue({
    components: {
      child: main,
    },
    data() {
      return {
        visible: true,
      };
    },
    template: `<div><child ref='child'/></div>`,
  }).$mount("#app");
  window.vm = vm;
}
