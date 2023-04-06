import CustomDivider from "./custom-divider.vue";
import CustomEditTable from "./custom-edit-table.vue";

export default {
  install(Vue) {
    Vue.component("customDivider", CustomDivider);
    Vue.component("customEditTable", CustomEditTable);
  },
};
