import Vue from "vue";
import { BUTTON_LIST } from "@/store/mutation-types";

function hasStr(arr, str) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == str) {
      return true;
    }
  }
  return false;
}

export default {
  inserted(el, bindling) {
    let perVal = bindling.value;
    const buttonList = Vue.ls.get(BUTTON_LIST) || [];
    if (bindling.value) {
      let hasPermision = hasStr(buttonList, perVal);
      if (!hasPermision) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    }
  },
};
