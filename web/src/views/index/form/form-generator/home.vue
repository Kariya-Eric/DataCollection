<template>
  <el-dialog
    v-if="visible"
    :visible="visible"
    fullscreen
    :show-close="false"
    :append-to-body="true"
  >
    <div slot="title">
      <el-row>
        <el-col :span="10">
          <el-tag type="warning" style="margin-right: 24px">{{
            info.type
          }}</el-tag>
          <span style="font-weight: bold; font-size: 18px"
            >{{ info.name }}（{{ info.collectTimeType }}）</span
          >
        </el-col>
        <el-col :span="10">
          <el-button
            :round="activeTab == 0"
            :type="activeTab == 0 ? 'primary' : 'text'"
            @click="() => (activeTab = 0)"
            >表单设计</el-button
          >
          <el-button
            :round="activeTab == 1"
            :type="activeTab == 1 ? 'primary' : 'text'"
            @click="() => (activeTab = 1)"
            >校验规则</el-button
          >
        </el-col>
        <el-col :span="4">
          <div class="search-button-admin">
            <el-button
              icon="el-icon-document-checked"
              type="primary"
              size="small"
              @click="save"
              >保存</el-button
            >
            <el-button icon="el-icon-back" size="small" @click="close"
              >返回</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="container" v-if="activeTab === 0">
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
          <div class="tinymceDiv">
            <h4>填报提示</h4>
            <tinymce v-model="formConf.formAlert" :height="100" />
            <el-divider />
          </div>
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
        :base-info="info"
        @tag-change="tagChange"
      />

      <form-drawer ref="formDrawer" />
    </div>
    <div class="container" v-else>
      <rule-detail />
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
} from "./generator/config";
import drawingDefault from "./config/drawingDefault";
import { saveDrawingList, getIdGlobal, saveIdGlobal } from "./utils/db";
import { deepClone } from "./utils";
import DraggableItem from "./components/draggable-item.vue";
import RightPanel from "./components/right-panel.vue";
import FormDrawer from "./components/form-drawer.vue";
import Tinymce from "components/Tinymce";
import RuleDetail from "../components/rule-detail";

let oldActiveId;
let tempActiveData;
const idGlobal = getIdGlobal();

export default {
  name: "FormGenerator",
  components: {
    draggable,
    DraggableItem,
    RightPanel,
    FormDrawer,
    Tinymce,
    RuleDetail,
  },
  data() {
    return {
      visible: false,
      idGlobal,
      info: {},
      formConf,
      activeTab: 0,
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
      drawingList: [],
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
    show(formInfo) {
      if (formInfo.type == "浮动表单") {
        this.leftComponents = [
          {
            title: "其他组件",
            list: otherComponents,
          },
        ];
      } else {
        this.leftComponents = [
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
        ];
      }
      this.activeTab = 0;
      this.info = JSON.parse(JSON.stringify(formInfo));
      this.visible = true;
      if (formInfo.formProperties != null) {
        const formProperties = JSON.parse(formInfo.formProperties);
        const componentProperties = JSON.parse(formInfo.componentProperties);
        this.formConf = formProperties;
        this.drawingList = componentProperties;
        if (this.drawingList.length > 0) {
          this.activeData = this.drawingList[0];
          this.activeId = this.drawingList[0].formId;
        }
      } else {
        this.formConf = {
          formRef: "myForm",
          formModel: "formData",
          size: "medium",
          labelPosition: "right",
          labelWidth: 120,
          formRules: "rules",
          gutter: 15,
          disabled: false,
          span: 24,
          formAlert: "",
          formBtns: true,
          componentsVisible: [],
        };
        this.formConf.componentsVisible = [];
        formConf.componentsVisible = this.formConf.componentsVisible;
        this.drawingList = [];
        this.idGlobal = 100;
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
      Object.keys(newTag).forEach((key) => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key];
        }
      });
      this.activeData = newTag;
      if (newTag.__config__.tag == "el-checkbox-group") {
        this.activeData.__config__.defaultValue = [];
      }
      this.updateDrawingList(newTag, this.drawingList);
    },

    updateDrawingList(newTag, list) {
      const index = list.findIndex(
        (item) => item.__config__.formId === this.activeId
      );
      if (index > -1) {
        list.splice(index, 1, newTag);
      }
    },

    empty() {
      this.$confirm("确定要清空所有组件吗？", "提示", { type: "warning" }).then(
        () => {
          this.formConf.componentsVisible = [];
          formConf.componentsVisible = this.formConf.componentsVisible;
          this.drawingList = [];
          this.idGlobal = 100;
        }
      );
    },

    run() {
      this.assembleFormData();
      formConf.componentsVisible = this.formConf.componentsVisible;
      this.$refs.formDrawer.show(this.formData, this.formConf);
    },

    assembleFormData() {
      this.formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf,
      };
    },

    save() {
      this.assembleFormData();
      this.$emit("saveForm", this.formData, this.info);
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
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 0ch;
  padding-bottom: 12px;
  border: 1px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
}
.tinymceDiv {
  margin-left: 12px;
  width: 97%;
}
</style>
