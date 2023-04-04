<template>
  <el-dialog :visible="visible" fullscreen @close="close">
    <div slot="title">
      <span>表单设计</span>
      <el-divider />
    </div>

    <div class="container">
      <div class="left-board">
        <div class="components-list">
          <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
            <div class="components-title">
              <svg-icon icon-class="component_1" />
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

      <div class="center-board">
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
      </div>

      <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="!!drawingList.length"
        @tag-change="tagChange"
      />
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
} from "./generator/config";
import drawingDefault from "./config/drawingDefault";
import {
  getDrawingList,
  saveDrawingList,
  getIdGlobal,
  saveIdGlobal,
  getFormConf,
} from "./utils/db";
import {
  beautifierConf,
  stringify,
  titleCase,
  deepClone,
  isObjectObject,
} from "./utils";
import DraggableItem from "./components/draggable-item.vue";
import RightPanel from "./components/right-panel.vue";

let oldActiveId;
let tempActiveData;
const idGlobal = getIdGlobal();

export default {
  name: "FormGenerator",
  components: { draggable, DraggableItem, RightPanel },
  data() {
    return {
      visible: false,
      idGlobal,
      formConf,
      inputComponents,
      selectComponents,
      layoutComponents,
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
      drawingList: drawingDefault,
      activeId: drawingDefault[0].formId,
      activeData: drawingDefault[0],
      saveDrawingListDebounce: debounce(340, saveDrawingList),
      saveIdGlobalDebounce: debounce(340, saveIdGlobal),
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

  },
};
</script>

<style lang="scss" scoped>
@import "./styles/home";
::v-deep .el-dialog__body {
  padding-top: 0px;
}
::v-deep .el-dialog__header {
  padding-bottom: 0px;
}
</style>