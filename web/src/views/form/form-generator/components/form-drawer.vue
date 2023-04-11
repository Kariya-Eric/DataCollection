<template>
  <div>
    <el-drawer
      append-to-body="true"
      modal-append-to-body="false"
      v-bind="$attrs"
      v-on="$listeners"
      :visible="visible"
      @close="onClose"
    >
      <p>123</p>
    </el-drawer>
  </div>
</template>

<script>
import { makeUpHtml } from "../generator/html";
import { makeUpJs } from "../generator/js";
import { makeUpCss } from "../generator/css";
const editorObj = {
  html: null,
  js: null,
  css: null,
};
export default {
  name: "FormDrawer",
  data() {
    return {
      editorObj,
      visible: false,
      formData: {},
      generateConf: null,
    };
  },
  methods: {
    show(formData, formConf) {
      this.generateConf = formConf;
      this.formData = formData;
      this.onOpen();
      this.visible = true;
    },

    onClose() {
      this.visible = false;
    },

    onOpen() {
      this.htmlCode = makeUpHtml(this.formData, "file");
      this.jsCode = makeUpJs(this.formData, "file");
      this.cssCode = makeUpCss(this.formData);
      this.editorObj.html = this.htmlCode;
      this.editorObj.js = this.jsCode;
      this.editorObj.css = this.cssCode;
    },
  },
};
</script>

<style>
</style>