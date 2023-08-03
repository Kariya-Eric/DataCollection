<template>
  <div style="height: 100%">
    <div style="height: 100%; overflow: auto">
      <div class="right-preview">
        <iframe
          v-show="isIframeLoaded"
          ref="previewPage"
          id="myIframe"
          class="result-wrapper"
          frameborder="0"
          :src="previewURL"
          @load="iframeLoad"
        />
        <div v-show="!isIframeLoaded" v-loading="true" class="result-wrapper" />
      </div>
    </div>
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
        var iframe = document.getElementById("myIframe");
        // 延时加载，处理iframe高度
        setTimeout(function () {
          var innerDoc =
            iframe.contentDocument || iframe.contentWindow.document;
          var innerHeight = innerDoc.body.scrollHeight;
          iframe.style.height = innerHeight + "px";
        }, 500);
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
              html: editorObj.html,
              js: jsCodeStr.replace(exportDefault, ""),
              css: editorObj.css,
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
  height: 100%;
  .result-wrapper {
    width: 100%;
  }
}
/deep/ .el-input__inner::placeholder {
  text-align: left;
}
/deep/ .el-input-number.is-controls-right .el-input__inner {
  text-align: left;
}
</style>
