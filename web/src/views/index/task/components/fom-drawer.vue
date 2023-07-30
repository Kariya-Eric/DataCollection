<template>
  <el-drawer
    :append-to-body="true"
    :visible="visible"
    size="80%"
    :show-close="false"
  >
    <div slot="title">
      <div slot="title" class="titleSlot">
        <span>{{ formInfo.formName }}</span>
        <div class="titleButton">
          <Mbutton name="下载导入模板" />
          <Mbutton type="primary" name="导入" />
          <Mbutton type="primary" name="导出数据" />
          <Mbutton type="primary" name="保存" />
          <Mbutton type="primary" name="提交" @click="submit" />
          <Mbutton name="返回" icon="返回" @click="close" />
        </div>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" style="height: 100%">
      <div class="right-preview">
        <el-row style="height: 100%; overflow: auto">
          <el-col :span="24">
            <iframe
              v-show="isIframeLoaded"
              ref="previewPage"
              class="result-wrapper"
              frameborder="0"
              :src="previewURL"
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
</template>

<script>
import { makeUpHtml } from "../utils/html";
import { makeUpJs } from "../utils/js";
import { makeUpCss } from "../../form/form-generator/generator/css";
import { parse } from "@babel/parser";
import { exportDefault } from "../../form/form-generator/utils/index";
import { updateTaskFormDetail } from "@/api/task";

const editorObj = {
  html: null,
  js: null,
  css: null,
};

export default {
  name: "FormDrawer",
  data() {
    return {
      visible: false,
      editorObj,
      formData: {},
      formInfo: {},
      generateConf: null,
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      isRefreshCode: false, // 每次打开都需要重新刷新代码
      previewURL: "",
    };
  },

  created() {
    window.getMessageFromFrame = this.getMessageFromFrame;
  },

  methods: {
    show(formData, formConf, info) {
      this.generateConf = formConf;
      this.formData = formData;
      this.formInfo = info;
      this.onOpen();
      this.visible = true;
    },

    onOpen() {
      this.previewURL =
        process.env.BASE_URL + ":" + process.env.BASE_PORT + "/preview.html";
      this.htmlCode = makeUpHtml(this.formData, this.generateConf);
      this.jsCode = makeUpJs(this.formData);
      this.cssCode = makeUpCss(this.formData);
      this.editorObj.html = this.htmlCode;
      this.editorObj.js = this.jsCode;
      this.editorObj.css = this.cssCode;
    },

    close() {
      this.visible = false;
      this.isInitcode = false;
      this.isRefreshCode = false;
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
          this.$refs.previewPage.contentWindow.postMessage({
            type: "resetForm",
          });
        } else {
          this.$message.error("请使用export default");
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`);
        console.error(err);
      }
    },

    submit() {
      let iframe = this.$refs.previewPage.contentWindow;
      iframe.postMessage({ type: "submitForm" });
    },

    getMessageFromFrame(value) {
      updateTaskFormDetail({
        id: this.formInfo.id,
        formData: JSON.stringify(value),
      }).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.close();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.right-preview {
  margin-left: 12px;
  margin-right: 12px;
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 33px);
    width: 100%;
    overflow: auto;
    padding: 6px;
    box-sizing: border-box;
  }
}

::v-deep .el-drawer__header {
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 0ch;
  padding-bottom: 12px;
  border: 1px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
