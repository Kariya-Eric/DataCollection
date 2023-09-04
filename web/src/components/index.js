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
import Select from "./Select";
import FormGenerator from "./FormGenerator";
import Ellipsis from "./Ellipsis";
import CustomComponents from "./FormGenerator/layouts";
import ElComponents from "./ElementUI";

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
    Vue.component("mbutton", Button);
    Vue.component("status", Status);
    Vue.component("formGenerator", FormGenerator);
    Vue.component("mselect", Select);
    Vue.component("ellipsis", Ellipsis);
    Vue.use(CustomComponents);
    Vue.use(ElComponents);
  },
};
