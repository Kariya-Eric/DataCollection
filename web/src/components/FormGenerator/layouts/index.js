import FormAddress from "./form-address";
import FormDivider from "./form-divider";
import FormLink from "./form-link";
import FormMail from "./form-mail";
import FormPhone from "./form-phone";

export default {
  install(Vue) {
    Vue.component("formAddress", FormAddress);
    Vue.component("formDivider", FormDivider);
    Vue.component("formLink", FormLink);
    Vue.component("formMail", FormMail);
    Vue.component("formPhone", FormPhone);
  },
};
