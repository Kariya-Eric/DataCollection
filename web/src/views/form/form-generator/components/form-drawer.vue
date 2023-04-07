<template>
  <div>
    <el-drawer
      v-bind="$attrs"
      v-on="$listeners"
      :visible="visible"
      @close="onClose"
      ><div style="height: 100%">
        <el-row style="height: 100%; overflow: auto">
          <el-col :md="24" :lg="12" class="right-preview">
            <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              src="preview.html"
              @load="iframeLoad"
            />
            <div
              v-show="!isIframeLoaded"
              v-loading="true"
              class="result-wrapper"
            />
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { parse } from "@babel/parser";
import { makeUpHtml } from "../generator/html";
import { makeUpJs } from "../generator/js";
import { makeUpCss } from "../generator/css";
import { exportDefault } from "../utils/index";
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
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
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
      this.isInitcode = false;
      this.isRefreshCode = false;
    },

    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true;
        this.isRefreshCode && (this.isInitcode = true) && this.runCode();
      }
    },

    onOpen() {
      this.htmlCode = makeUpHtml(this.formData, "file");
      this.jsCode = makeUpJs(this.formData, "file");
      this.cssCode = makeUpCss(this.formData);
      this.editorObj.html = this.htmlCode;
      this.editorObj.js = this.jsCode;
      this.editorObj.css = this.cssCode;
    },

    runCode() {
      const jsCodeStr = this.editorObj.js;
      console.log(jsCodeStr);
      try {
        const ast = parse(jsCodeStr, { sourceType: "module" });
        const astBody = ast.program.body;
        console.log(astBody);
        if (astBody.length > 1) {
          this.$confirm(
            "js格式不能识别，仅支持修改export default的对象内容",
            "提示",
            {
              type: "warning",
            }
          );
          return;
        }
        if (astBody[0].type === "ExportDefaultDeclaration") {
          const postData = {
            type: "refreshFrame",
            data: {
              generateConf: this.generateConf,
              html: this.editorObj.html,
              js: jsCodeStr.replace(exportDefault, ""),
              css: this.editorObj.css,
            },
          };

          this.$refs.previewPage.contentWindow.postMessage(
            postData,
            location.origin
          );
        } else {
          this.$message.error("请使用export default");
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`);
        console.error(err);
      }
    },
  },
};
</script>

<style>
</style>