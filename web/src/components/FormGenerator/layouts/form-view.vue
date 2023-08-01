<template>
  <div class="right-preview">
    <iframe
      v-show="isIframeLoaded"
      ref="previewPage"
      class="result-wrapper"
      frameborder="0"
      :src="previewURL"
      @load="iframeLoad"
    />
    <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
  </div>
</template>

<script>
// 表单预览页面
import { makeUpHtml } from "../utils/html";
import { makeUpJs } from "../utils/js";
import { makeUpCss } from "../utils/css";
import { parse } from "@babel/parser";
import { exportDefault } from "../utils/index";

const editorObj = {
  html: null,
  js: null,
  css: null,
};

export default {
  name: "FormView",
  props: ["formConf"],
  data() {
    return {
      editorObj,
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      previewURL: "",
    };
  },

  watch: {
    formConf: {
      handler(newVal) {
        this.isInitcode = false;
        this.previewURL =
          process.env.BASE_URL + ":" + process.env.BASE_PORT + "/preview.html";
        this.editorObj.html = makeUpHtml(newVal);
        this.editorObj.js = makeUpJs(newVal);
        this.editorObj.css = makeUpCss(newVal);
      },
      immediate: true,
    },
  },
  methods: {
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true;
        this.isInitcode = true;
        this.runCode();
      }
    },

    runCode() {
      const jsCodeStr = editorObj.js;
      try {
        const ast = parse(jsCodeStr, { sourceType: "module" });
        const astBody = ast.program.body;
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
              html: editorObj.html,
              js: jsCodeStr.replace(exportDefault, ""),
              css: editorObj.css,
              scripts: this.scripts,
              links: this.links,
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

<style scoped lang="scss">
.right-preview {
  margin-left: 36px;
  margin-right: 36px;
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
  }
}
</style>
