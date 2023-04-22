<template>
  <div>
    <el-drawer
      :append-to-body="true"
      v-bind="$attrs"
      v-on="$listeners"
      :visible="visible"
      @close="onClose"
      size="80%"
      title="表单预览"
    >
      <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
        <div class="right-preview">
          <el-row style="height: 100%; overflow: auto">
            <el-col :span="24">
              <iframe
                v-show="isIframeLoaded"
                ref="previewPage"
                class="result-wrapper"
                frameborder="0"
                src="http://localhost:9000/preview.html"
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
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script>
import { makeUpHtml } from "../generator/html";
import { makeUpJs } from "../generator/js";
import { makeUpCss } from "../generator/css";
import { parse } from "@babel/parser";
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
      formData: {},
      generateConf: null,
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
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

    onOpen() {
      console.log("for", this.formData);
      this.htmlCode = makeUpHtml(this.formData);
      this.jsCode = makeUpJs(this.formData, "file");
      this.cssCode = makeUpCss(this.formData);
      this.editorObj.html = this.htmlCode;
      this.editorObj.js = this.jsCode;
      this.editorObj.css = this.cssCode;
    },

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

<style lang="scss" scoped>
.right-preview {
  margin-left: 36px;
  margin-right: 36px;
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
</style>
