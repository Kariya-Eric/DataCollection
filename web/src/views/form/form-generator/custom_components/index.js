import CustomDivider from "./custom-divider";
import CustomEditTable from "./custom-edit-table";
import CustomFloatTable from "./custom-float-table";

export default {
  install(Vue) {
    Vue.component("customDivider", CustomDivider);
    Vue.component("customEditTable", CustomEditTable);
    Vue.component("customFloatTable", CustomFloatTable);
  },
};
