<template>
  <el-dialog :visible="visible" fullscreen @close="close">
    <div slot="title">
      <span>表单设计</span>
    </div>

    <div class="container">
      <div class="left-board">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="grid" />
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
        </div>
      </div>
      <div class="center-board" style="overflow: hidden">
        <div class="action-bar">
          <el-button icon="el-icon-view" type="text" @click="run">
            预览
          </el-button>
          <el-button icon="el-icon-document-checked" type="text" @click="save">
            保存
          </el-button>
          <el-button
            class="delete-btn"
            icon="el-icon-delete"
            type="text"
            @click="empty"
          >
            清空
          </el-button>
        </div>
        <el-scrollbar class="center-scrollbar">
          <el-row class="center-board-row" :gutter="formConf.gutter">
            <el-form
              :size="formConf.size"
              :label-position="formConf.labelPosition"
              :disabled="formConf.disabled"
              :label-width="formConf.labelWidth + 'px'"
            >
              <draggable
                class="drawing-board"
                :list="drawingList"
                :animation="340"
                group="componentsGroup"
              >
                <draggable-item
                  v-for="(item, index) in drawingList"
                  :key="item.renderKey"
                  :drawing-list="drawingList"
                  :current-item="item"
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
            </el-form>
          </el-row>
        </el-scrollbar>
      </div>

      <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="!!drawingList.length"
        @tag-change="tagChange"
        @setHide="setHide"
      />

      <form-drawer ref="formDrawer" />
    </div>
  </el-dialog>
</template>

<script>
import draggable from "vuedraggable";
import { debounce } from "throttle-debounce";
import {
  formConf,
  inputComponents,
  selectComponents,
  layoutComponents,
  otherComponents,
  componentsVisible,
} from "./generator/config";
import drawingDefault from "./config/drawingDefault";
import { saveDrawingList, getIdGlobal, saveIdGlobal } from "./utils/db";
import { deepClone } from "./utils";
import DraggableItem from "./components/draggable-item.vue";
import RightPanel from "./components/right-panel.vue";
import FormDrawer from "./components/form-drawer.vue";

let oldActiveId;
let tempActiveData;
const idGlobal = getIdGlobal();

export default {
  name: "FormGenerator",
  components: { draggable, DraggableItem, RightPanel, FormDrawer },
  data() {
    return {
      visible: false,
      idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
      otherComponents,
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
          title: "其他组件",
          list: otherComponents,
        },
        {
          title: "布局型组件",
          list: layoutComponents,
        },
      ],
      drawingList: drawingDefault,
      activeId: drawingDefault[0].formId,
      activeData: drawingDefault[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
      drawerVisible: false,
      formData: {},
    };
  },

  watch: {
    activeId: {
      handler(val) {
        oldActiveId = val;
      },
      immediate: true,
    },
    drawingList: {
      handler(val) {
        this.saveDrawingListDebounce(val);
        if (val.length === 0) this.idGlobal = 100;
      },
      deep: true,
    },
    idGlobal: {
      handler(val) {
        this.saveIdGlobalDebounce(val);
      },
      immediate: true,
    },
  },
  methods: {
    show() {
      this.visible = true;
      const config = this.drawingList[0].__config__;
      const componentName = config.label;
      if (config.layout === "customItem") {
        config.componentName = componentName;
        delete config.label;
        delete config.span;
      }
    },
    close() {
      this.visible = false;
    },

    addComponent(item) {
      const clone = this.cloneComponent(item);
      //this.fetchData(clone);
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

    activeFormItem(currentItem) {
      this.activeData = currentItem;
      this.activeId = currentItem.__config__.formId;
    },

    createIdAndKey(item) {
      const config = item.__config__;
      config.formId = ++this.idGlobal;
      config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
      if (config.layout === "colFormItem" || config.layout === "customTable") {
        item.__vModel__ = `field${this.idGlobal}`;
      } else if (config.layout === "customItem") {
        config.componentName = config.label;
        delete config.label;
        delete config.span;
      }
      return item;
    },

    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData;
        this.activeId = this.idGlobal;
      }
    },

    drawingItemCopy(item, list) {
      let clone = deepClone(item);
      clone = this.createIdAndKey(clone);
      list.push(clone);
      this.activeFormItem(clone);
    },

    drawingItemDelete(index, list) {
      list.splice(index, 1);
      this.$nextTick(() => {
        const len = this.drawingList.length;
        if (len) {
          this.activeFormItem(this.drawingList[len - 1]);
        }
      });
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

    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.drawingList = [];
          this.idGlobal = 100;
        }
      );
    },

    run() {
      this.assembleFormData();
      this.$refs.formDrawer.show(this.formData);
    },

    assembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf,
      };
    },

    save() {
      this.assembleFormData();
      console.log("form", this.formData);
    },

    setHide(radioConfig, optionVal, hiddenList) {
      //找到radioConfig相关的所有visible并清除
      let temp = componentsVisible.filter(
        (component) =>
          component.showLogic.formId !== radioConfig.__config__.formId
      );
      hiddenList.forEach((hidden) => {
        let componentVisible = {
          formId: hidden,
          showLogic: {
            formId: radioConfig.__config__.formId,
            formVModel: radioConfig.__vModel__,
            optionValue: optionVal,
          },
        };
        temp.push(componentVisible);
      });
      componentsVisible.length = 0;
      temp.forEach((t) => componentsVisible.push(t));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/home";
::v-deep .el-dialog__body {
  padding: 8px;
}
::v-deep .el-dialog__header {
  padding-bottom: 12px;
  border: 1px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
}
</style>
