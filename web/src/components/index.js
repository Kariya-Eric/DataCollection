import Breadcrumb from "./Breadcrumb";
import Hamburger from "./Hamburger";
import Pagination from "./Pagination";
import Result from "./Result/Result";
import SelectTree from "./SelectTree";
import SvgIcon from "./SvgIcon";
import Tinymce from "./Tinymce";
import MenuLink from "./MenuLink";
import Button from "./Button";
import Status from "./Status";
import FormGenerator from "./FormGenerator";
import CustomComponents from "./FormGenerator/layouts";

export default {
  install(Vue) {
    Vue.component("breadcrumb", Breadcrumb);
    Vue.component("hamburger", Hamburger);
    Vue.component("pagination", Pagination);
    Vue.component("result", Result);
    Vue.component("selectTree", SelectTree);
    Vue.component("svgIcon", SvgIcon);
    Vue.component("tinymce", Tinymce);
    Vue.component("menuLink", MenuLink);
    Vue.component("Mbutton", Button);
    Vue.component("status", Status);
    Vue.component("formGenerator", FormGenerator);
    Vue.use(CustomComponents);
  },
};
