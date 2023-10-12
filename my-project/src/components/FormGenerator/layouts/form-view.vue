<template>
  <div style="height: 100vh">
    <a-row style="height: 100vh; overflow: auto">
      <a-col :md="24" :lg="24" class="right-preview">
        <a-spin :spinning="!isIframeLoaded"> </a-spin>
        <iframe v-show="isIframeLoaded" ref="previewPage" class="result-wrapper" frameborder="0" :src="previewURL" @load="iframeLoad" />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { makeUpHtml } from '../utils/html'
import { makeUpJs } from '../utils/js'
import { makeUpCss } from '../utils/css'
import { parse } from '@babel/parser'
import { exportDefault } from '../utils/index'

const editorObj = {
  html: null,
  js: null,
  css: null
}

export default {
  name: 'FormView',
  props: ['formConf'],
  data() {
    return {
      editorObj,
      isIframeLoaded: false,
      isInitcode: false, // 保证open后两个异步只执行一次runcode
      previewURL: ''
    }
  },

  created() {
    window.getMessageFromFrame = this.getMessageFromFrame
  },

  watch: {
    formConf: {
      handler(newVal) {
        this.isInitcode = false
        this.previewURL = process.env.VUE_APP_BASE_URL + ':' + process.env.VUE_APP_BASE_PORT + '/preview.html'
        this.editorObj.html = makeUpHtml(newVal)
        this.editorObj.js = makeUpJs(newVal)
        this.editorObj.css = makeUpCss(newVal)
      },
      immediate: true
    }
  },
  methods: {
    iframeLoad() {
      if (!this.isInitcode) {
        this.isIframeLoaded = true
        this.isInitcode = true
        this.runCode()
      }
    },

    runCode() {
      const jsCodeStr = editorObj.js
      try {
        const ast = parse(jsCodeStr, { sourceType: 'module' })
        const astBody = ast.program.body
        if (astBody.length > 1) {
          this.$confirm('js格式不能识别，仅支持修改export default的对象内容', '提示', {
            type: 'warning'
          })
          return
        }
        if (astBody[0].type === 'ExportDefaultDeclaration') {
          const postData = {
            type: 'refreshFrame',
            data: {
              html: editorObj.html,
              js: jsCodeStr.replace(exportDefault, ''),
              css: editorObj.css
            }
          }

          this.$refs.previewPage.contentWindow.postMessage(postData, location.origin)
        } else {
          this.$message.error('请使用export default')
        }
      } catch (err) {
        this.$message.error(`js错误：${err}`)
        console.error(err)
      }
    },

    getMessageFromFrame(value) {
      if (value.hasOwnProperty('submit')) {
        this.$emit('submit', value.submit)
      }
      if (value.hasOwnProperty('save')) {
        this.$emit('save', value.save)
      }
    },

    post(type) {
      let iframe = this.$refs.previewPage.contentWindow
      iframe.postMessage(type)
    },

    submit() {
      let iframe = this.$refs.previewPage.contentWindow
      iframe.postMessage({ type: 'submitForm' })
    },

    save() {
      let iframe = this.$refs.previewPage.contentWindow
      iframe.postMessage({ type: 'saveForm' })
    }
  }
}
</script>

<style lang="less" scoped>
.right-preview {
  height: 100%;
  .result-wrapper {
    height: calc(100vh - 40px);
    width: 100%;
    overflow: auto;
    padding: 12px;
    box-sizing: border-box;
  }
}
</style>
