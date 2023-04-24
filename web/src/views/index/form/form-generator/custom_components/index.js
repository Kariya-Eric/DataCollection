import CustomDivider from "./custom-divider";
import CustomEditTable from "./custom-edit-table";
import CustomPhone from "./custom-phone";
import CustomMail from "./custom-mail";
import CustomAddress from './custom-address';
import CustomNumber from './custom-number';

export default {
  install(Vue) {
    Vue.component("customDivider", CustomDivider);
    Vue.component("customEditTable", CustomEditTable);
    Vue.component("customPhone", CustomPhone);
    Vue.component("customMail", CustomMail);
    Vue.component("customNumber", CustomNumber);
    Vue.component("customAddress", CustomAddress);
  },
};
