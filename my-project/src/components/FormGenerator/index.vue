<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :collapsed-width="0" :width="250" theme="light" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }">
      <div class="left-main">
        <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
          <a-divider orientation="left"> <a-icon type="control" />{{ item.title }} </a-divider>
          <draggable
            class="components-draggable"
            :list="item.list"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div v-for="(element, index) in item.list" :key="index" class="components-item" @click="addComponent(element)">
              <div class="components-body">
                <svg-icon :icon-class="element.__config__.tagIcon" />
                {{ element.__config__.label }}
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </a-layout-sider>

    <a-layout :style="{ marginLeft: '250px', marginRight: '350px' }">
      <a-layout-content>
        <div class="center-main">
          <div class="tinymceDiv">
            <h4>填报提示</h4>
            <tinymce v-model="formConf.formAlert" :height="100" />
          </div>
          <a-row class="center-board-row">
            <a-form-model
              :label-align="formConf.labelAlign"
              :layout="formConf.layout"
              :label-col="formConf.layout === 'horizontal' ? formConf.labelCol : null"
              :wrapper-col="formConf.layout === 'horizontal' ? formConf.wrapperCol : null"
              :size="formConf.size"
            >
              <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup">
                <drag-item
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
              <a-result v-show="!drawingList.length" title="从左侧拖入或点选组件进行表单设计"> </a-result>
            </a-form-model>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider :style="{ overflow: 'auto', height: '100vh', position: 'fixed', right: 0 }" :collapsed-width="0" :width="350" theme="light">
      <right-panel
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="drawingList.length != 0"
        :base-info="formInfo"
        :drawing-list="drawingList"
        @tag-change="tagChange"
      />
    </a-layout-sider>
  </a-layout>
</template>

<script>
import draggable from 'vuedraggable'
import { inputComponentsFix, selectComponentsFix, layoutComponentsFix, otherComponentsFix } from './config/config_fix'
import { otherComponentsFloat } from './config/config_float'
import { formConf } from './config/default'
import DragItem from './components/drag-item.vue'
import RightPanel from './components/right-panel.vue'
import { deepClone } from './utils'

let tempActiveData
let idGlobal = 100

export default {
  name: 'FormGenerator',
  components: { DragItem, draggable, RightPanel },
  data() {
    return {
      idGlobal,
      formConf: this.formConfig == null ? JSON.parse(JSON.stringify(formConf)) : this.formConfig,
      inputComponentsFix,
      selectComponentsFix,
      layoutComponentsFix,
      otherComponentsFix,
      otherComponentsFloat,
      activeId: this.drawingList.length == 0 ? 100 : this.drawingList[0].formId,
      activeData: this.drawingList[0]
    }
  },
  props: ['formInfo', 'drawingList', 'formConfig'],
  computed: {
    leftComponents() {
      if (this.formInfo.type == '固定表单') {
        return [
          {
            title: '输入型组件',
            list: inputComponentsFix
          },
          {
            title: '选择型组件',
            list: selectComponentsFix
          },
          {
            title: '其他组件',
            list: otherComponentsFix
          },
          {
            title: '布局型组件',
            list: layoutComponentsFix
          }
        ]
      } else {
        return [
          {
            title: '其他组件',
            list: otherComponentsFloat
          }
        ]
      }
    }
  },
  methods: {
    addComponent(item) {
      const clone = this.cloneComponent(item)
      this.drawingList.push(clone)
      this.activeFormItem(clone)
    },

    cloneComponent(origin) {
      const clone = deepClone(origin)
      const config = clone.__config__
      config.span = this.formConf.span // 生成代码时，会根据span做精简判断
      this.createIdAndKey(clone)
      clone.placeholder !== undefined && (clone.placeholder += config.label)
      tempActiveData = clone
      return tempActiveData
    },

    activeFormItem(currentItem) {
      this.activeData = currentItem
      this.activeId = currentItem.__config__.formId
    },

    createIdAndKey(item) {
      if (this.drawingList.length > 0) {
        let max = Math.max(...this.drawingList.map(item => item.__config__.formId))
        this.idGlobal = max
      }
      const config = item.__config__
      config.formId = ++this.idGlobal
      config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
      if (config.layout === 'colFormItem' || config.layout === 'tableLayout') {
        item.__vModel__ = `field${this.idGlobal}`
      }
      return item
    },

    onEnd(obj) {
      if (obj.from !== obj.to) {
        this.activeData = tempActiveData
        this.activeId = this.idGlobal
      }
    },

    drawingItemCopy(item, list) {
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(clone)
    },

    drawingItemDelete(index, list) {
      list.splice(index, 1)
      this.$nextTick(() => {
        const len = this.drawingList.length
        if (len) {
          this.activeFormItem(this.drawingList[len - 1])
        }
      })
    },

    tagChange(newTag) {
      newTag = this.cloneComponent(newTag)
      const config = newTag.__config__
      newTag.__vModel__ = this.activeData.__vModel__
      config.formId = this.activeId
      config.span = this.activeData.__config__.span
      this.activeData.__config__.tag = config.tag
      this.activeData.__config__.tagIcon = config.tagIcon
      Object.keys(newTag).forEach(key => {
        if (this.activeData[key] !== undefined) {
          newTag[key] = this.activeData[key]
        }
      })
      this.activeData = newTag
      if (newTag.__config__.tag == 'el-checkbox-group') {
        this.activeData.__config__.defaultValue = []
      }
      this.updateDrawingList(newTag, this.drawingList)
    },

    updateDrawingList(newTag, list) {
      const index = list.findIndex(item => item.__config__.formId === this.activeId)
      if (index > -1) {
        list.splice(index, 1, newTag)
      }
    },

    view() {
      let formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
      this.$emit('view', formData)
    },

    save() {
      let formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
      this.$emit('save', formData)
    }
  }
}
</script>

<style lang="scss" scoped>
@import './styles/home';
.tinymceDiv {
  margin-left: 24px;
  margin-bottom: 12px;
  width: 97%;
}
</style>