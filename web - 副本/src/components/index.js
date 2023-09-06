import Breadcrumb from "./Breadcrumb";
import SvgIcon from "./SvgIcon";
import Tinymce from "./Tinymce";
import Status from "./Status";
import FormGenerator from "./FormGenerator";
import Ellipsis from "./Ellipsis";
import Table from "./Table";
import Form from "./Form";
import Dialog from "./Dialog";
import Search from "./Search";
import CustomComponents from "./FormGenerator/layouts";

export default {
  install(Vue) {
    Vue.component("breadcrumb", Breadcrumb);
    Vue.component("svgIcon", SvgIcon);
    Vue.component("tinymce", Tinymce);
    Vue.component("status", Status);
    Vue.component("formGenerator", FormGenerator);
    Vue.component("ellipsis", Ellipsis);
    Vue.component("mtable", Table);
    Vue.component("mform", Form);
    Vue.component("mdialog", Dialog);
    Vue.component("msearch", Search);
    Vue.use(CustomComponents);
  },
};
