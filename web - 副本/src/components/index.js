import Breadcrumb from "./Breadcrumb";
import SvgIcon from "./SvgIcon";
import Tinymce from "./Tinymce";
import FormGenerator from "./FormGenerator";
import CustomComponents from "./FormGenerator/layouts";
import DCComponents from './dataCollection'

export default {
  install(Vue) {
    Vue.component("breadcrumb", Breadcrumb);
    Vue.component("svgIcon", SvgIcon);
    Vue.component("tinymce", Tinymce);
    Vue.component("formGenerator", FormGenerator);
    Vue.use(CustomComponents);
    Vue.use(DCComponents);
  },
};
