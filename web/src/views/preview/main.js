import Vue from "vue";
import ElementUI from "element-ui";
import "@/styles/element-ui.scss";
import locale from "element-ui/lib/locale/lang/zh-CN"; // lang i18n

Vue.use(ElementUI, {
  locale,
});

import Components from "@/components";
Vue.use(Components);

import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
import VXETablePluginElement from "vxe-table-plugin-element";
import "vxe-table-plugin-element/dist/style.css";
Vue.use(VXETable);
VXETable.use(VXETablePluginElement);

Vue.use(VXETable);

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
        parent.getMessageFromFrame({ submit: res });
      }
    });
  }
}

function newVue(main, html) {
  main = eval(`(${main})`);
  main.template = `<div>${html}</div>`;
  const vm = new Vue({
    components: {
      child: main,
    },
    methods: {
      resize() {
        parent.getMessageFromFrame({ resize: true });
      },
    },
    template: `<div><child ref='child' @resize="resize"/></div>`,
  }).$mount("#app");
  window.vm = vm;
}
