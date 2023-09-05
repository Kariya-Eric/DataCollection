import Breadcrumb from "./Breadcrumb";
import Hamburger from "./Hamburger";
import Pagination from "./Pagination";
import Result from "./Result/Result";
import SvgIcon from "./SvgIcon";
import Tinymce from "./Tinymce";
import MenuLink from "./MenuLink";
import Button from "./Button";
import Status from "./Status";
import FormGenerator from "./FormGenerator";
import Ellipsis from "./Ellipsis";
import Table from './Table'
import CustomComponents from "./FormGenerator/layouts"


export default {
  install(Vue) {
    Vue.component("breadcrumb", Breadcrumb);
    Vue.component("hamburger", Hamburger);
    Vue.component("pagination", Pagination);
    Vue.component("result", Result);
    Vue.component("svgIcon", SvgIcon);
    Vue.component("tinymce", Tinymce);
    Vue.component("menuLink", MenuLink);
    Vue.component("mbutton", Button);
    Vue.component("status", Status);
    Vue.component("formGenerator", FormGenerator);
    Vue.component("ellipsis", Ellipsis);
    Vue.component("mtable", Table)
    Vue.use(CustomComponents);
  },
};
