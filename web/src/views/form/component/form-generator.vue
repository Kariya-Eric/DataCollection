<template>
  <a-modal
    width="100%"
    wrap-class-name="full-modal"
    :visible="visible"
    @cancel="close"
  >
    <a-row>
      <a-col :span="4"
        ><div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component" />
              {{ item.title }}
            </div>
            <draggable
              class="components-draggable"
              :list="item.list"
              :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
              :clone="cloneComponent"
              draggable=".components-item"
              :sort="false"
              @end="onEnd"
            >
              <div
                v-for="(element, index) in item.list"
                :key="index"
                class="components-item"
                @click="addComponent(element)"
              >
                <div class="components-body">
                  <svg-icon :icon-class="element.__config__.tagIcon" />
                  {{ element.__config__.label }}
                </div>
              </div>
            </draggable>
          </div>
        </div></a-col
      >
      <a-col :span="14">
        <a-row class="center-board-row" :gutter="formConf.gutter">
          <a-form :size="formConf.size"
            ><draggable
              class="drawing-board"
              :list="drawingList"
              :animation="340"
              group="componentsGroup"
            >
              <draggable-item
                v-for="(element, index) in drawingList"
                :key="element.renderKey"
                :drawing-list="drawingList"
                :element="element"
                :index="index"
                :active-id="activeId"
                :form-conf="formConf"
                @activeItem="activeFormItem"
                @copyItem="drawingItemCopy"
                @deleteItem="drawingItemDelete"
              />
            </draggable>
            <div v-show="!drawingList.length" class="empty-info">
              从左侧拖入或点选组件进行表单设计
            </div>
          </a-form>
        </a-row>
      </a-col>
      <a-col :span="6">
        <right-panel
          :active-data="activeData"
          :form-conf="formConf"
          :show-field="!!drawingList.length"
          @tag-change="tagChange"
        />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import draggable from "vuedraggable";
import SvgIcon from "./icon/index.vue";
import {
  formConf,
  inputComponents,
  selectComponents,
  layoutComponents,
} from "./generator/config";
import { deepClone } from "./utils";
import { debounce } from "throttle-debounce";
import drawingDefault from "./generator/drawing-default";
import { getIdGlobal, saveDrawingList } from "./utils/db";
import DraggableItem from "./generator/draggable-item.vue";
import RightPanel from "./generator/right-panel.vue";

let tempActiveData;
export default {
  name: "FormGenerator",
  components: {
    draggable,
    SvgIcon,
    DraggableItem,
    RightPanel,
  },
  data() {
    return {
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      visible: false,
      drawingList: drawingDefault,
      activeData: drawingDefault[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      leftComponents: [
        {
          title: "输入型组件",
          list: inputComponents,
        },
        {
          title: "选择型组件",
          list: selectComponents,
        },
        {
          title: "布局型组件",
          list: layoutComponents,
        },
      ],
    };
  },
  watch: {
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val);
        if (val.length === 0) this.idGlobal = 100;
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    show() {
      this.visible = true;
    },

    close() {
      this.visible = false;
    },

    activeFormItem(element) {
      this.activeData = element;
      this.activeId = element.__config__.formId;
    },
    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },
    addComponent(item) {
      const clone = this.cloneComponent(item);
      this.drawingList.push(clone);
      this.activeFormItem(clone);
    },
    cloneComponent(origin) {
      const clone = deepClone(origin);
      const config = clone.__config__;
      config.span = this.formConf.span; // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone);
      clone.placeholder !== undefined && (clone.placeholder += config.label);
      tempActiveData = clone;
      return tempActiveData;
    },
    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = +new Date(); // 改变renderKey后可以实现强制更新组件
      if (config.layout === "colFormItem") {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === "rowFormItem") {
        config.componentName = `row${this.idGlobal}`;
        !Array.isArray(config.children) && (config.children = []);
        delete config.label; // rowFormItem无需配置label属性
      }
      if (Array.isArray(config.children)) {
        config.children = config.children.map((childItem) =>
          this.createIdAndKey(childItem)
        );
      }
      return item;
    },
    AssembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf,
      };
    },
    generate(data) {
      const func = this[`exec${titleCase(this.operationType)}`];
      this.generateConf = data;
      func && func(data);
    },
    execRun(data) {
      this.AssembleFormData();
      this.drawerVisible = true;
    },
    execDownload(data) {
      const codeStr = this.generateCode();
      const blob = new Blob([codeStr], { type: "text/plain;charset=utf-8" });
      saveAs(blob, data.fileName);
    },
    execCopy(data) {
      document.getElementById("copyNode").click();
    },
    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = [];
          this.idGlobal = 100;
        }
      );
    },
    drawingItemCopy(item, parent) {
      let clone = deepClone(item);
      clone = this.createIdAndKey(clone);
      parent.push(clone);
      this.activeFormItem(clone);
    },
    drawingItemDelete(index, parent) {
      parent.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
    },
    generateCode() {
      const { type } = this.generateConf;
      this.AssembleFormData();
      const script = vueScript(makeUpJs(this.formData, type));
      const html = vueTemplate(makeUpHtml(this.formData, type));
      const css = cssStyle(makeUpCss(this.formData));
      return beautifier.html(html + script + css, beautifierConf.html);
    },
    showJson() {
      this.AssembleFormData();
      this.jsonDrawerVisible = true;
    },
    download() {
      this.dialogVisible = true;
      this.showFileName = true;
      this.operationType = "download";
    },
    run() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "run";
    },
    copy() {
      this.dialogVisible = true;
      this.showFileName = false;
      this.operationType = "copy";
    },
    tagChange(newTag) {
      newTag = this.cloneComponent(newTag);
      const config = newTag.__config__;
      newTag.__vModel__ = this.activeData.__vModel__;
      config.formId = this.activeId;
      config.span = this.activeData.__config__.span;
      this.activeData.__config__.tag = config.tag;
      this.activeData.__config__.tagIcon = config.tagIcon;
      this.activeData.__config__.document = config.document;
      if (
        typeof this.activeData.__config__.defaultValue ===
        typeof config.defaultValue
      ) {
        config.defaultValue = this.activeData.__config__.defaultValue;
      }
      Object.keys(newTag).forEach((key) => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      this.updateDrawingList(newTag, this.drawingList);
    },
    updateDrawingList(newTag, list) {
      const index = list.findIndex(
        (item) => item.__config__.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      } else {
        list.forEach((item) => {
          if (Array.isArray(item.__config__.children))
            this.updateDrawingList(newTag, item.__config__.children);
        });
      }
    },
    refreshJson(data) {
      this.drawingList = deepClone(data.fields);
      delete data.fields;
      this.formConf = data;
    },
  },
};
</script>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}

.components-list {
  padding: 8px;
  box-sizing: border-box;
  height: 100%;
  .components-item {
    display: inline-block;
    width: 48%;
    margin: 1%;
    transition: transform 0ms !important;
  }
}

.components-title {
  font-size: 14px;
  color: #222;
  margin: 6px 2px;
  .svg-icon {
    color: #666;
    font-size: 18px;
  }
}

.components-draggable {
  padding-bottom: 20px;
}
</style>
