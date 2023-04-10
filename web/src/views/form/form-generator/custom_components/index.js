import CustomDivider from "./custom-divider";
import CustomEditTable from "./custom-edit-table";
import CustomFloatTable from "./custom-float-table";
import CustomPhone from "./custom-phone";
import CustomMail from "./custom-mail";

export default {
  install(Vue) {
    Vue.component("customDivider", CustomDivider);
    Vue.component("customEditTable", CustomEditTable);
    Vue.component("customFloatTable", CustomFloatTable);
    Vue.component("customPhone", CustomPhone);
    Vue.component("customMail", CustomMail);
  },
};
