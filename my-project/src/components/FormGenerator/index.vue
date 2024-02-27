<template>
  <a-layout id="components-layout-demo-fixed-sider">
    <a-layout-sider :collapsed-width="0" :width="280" theme="light" :style="{ height: '100vh', position: 'fixed', left: 0 }">
      <div class="left-main">
        <div v-for="(item, listIndex) in leftComponents" :key="listIndex">
          <a-divider orientation="left">
            <a-icon type="control" />
            {{ item.title }}
          </a-divider>
          <draggable
            :disabled="disabled"
            class="components-draggable"
            :list="item.list"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
          >
            <div v-for="(element, index) in item.list" :key="index" class="components-item" @click="addComponent(element)">
              <div class="components-body"><dc-icon :type="element.__config__.tagIcon" style="margin-right: 8px" />{{ element.__config__.label }}</div>
            </div>
          </draggable>
        </div>
      </div>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '280px', marginRight: '350px' }">
      <div class="center-main">
        <a-layout-content>
          <a-row class="center-board-row">
            <div class="tinymce-div">
              <h4>填报提示</h4>
              <tinymce v-model="formConf.formAlert" :height="100" :disabled="disabled" />
            </div>
            <a-form-model :label-align="formConf.labelAlign" layout="horizontal" :size="formConf.size">
              <draggable class="drawing-board" :list="drawingList" :animation="340" group="componentsGroup" :disabled="disabled">
                <drag-item
                  class="center-drag-item"
                  v-for="(item, index) in drawingList"
                  :key="item.renderKey"
                  :disabled="disabled"
                  :drawing-list="drawingList"
                  :current-item="item"
                  :index="index"
                  :active-id="activeId"
                  :form-conf="formConf"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete"
                />
                <div v-show="!drawingList.length" class="empty-info">从左侧拖入或点选组件进行表单设计</div>
              </draggable>
            </a-form-model>
          </a-row>
        </a-layout-content>
      </div>
    </a-layout>
    <a-layout-sider :collapsed-width="0" :width="350" theme="light" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', right: 0 }">
      <right-panel
        id="right-panel"
        :active-data="activeData"
        :form-conf="formConf"
        :show-field="drawingList.length != 0"
        :disabled="disabled"
        :base-info="formInfo"
        :drawing-list="drawingList"
        @tag-change="tagChange"
      />
    </a-layout-sider>
  </a-layout>
</template>

<script>
import intro from './utils/intro'
import draggable from 'vuedraggable'
import { inputComponentsFix, selectComponentsFix, layoutComponentsFix, otherComponentsFix } from './config/config_fix'
import { otherComponentsFloat } from './config/config_float'
import { formConf } from './config/default'
import DragItem from './components/drag-item.vue'
import RightPanel from './components/right-panel.vue'
import { USER_INFO, FORM_CACHE } from '@/store/mutation-types'
import storage from 'store'
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
      activeData: this.drawingList[0],
      isEmpty: false,
      currentUser: storage.get(USER_INFO)
    }
  },
  props: ['formInfo', 'drawingList', 'formConfig', 'disabled'],
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
  mounted() {
    if (this.isFirstUse()) {
      if (this.drawingList.length == 0) {
        this.isEmpty = true
        this.addComponent(this.leftComponents[0].list[0])
      }
      this.$nextTick(() => this.guide())
    }
  },
  methods: {
    addComponent(item) {
      if (this.disabled) {
        return
      }
      if (this.formInfo.type == '浮动表单' && this.drawingList.length == 1) {
        this.$notification['warning']({
          message: '请勿重复添加组件!',
          description: '浮动表单无法重复添加组件',
          duration: 0
        })
        return
      }
      if (this.validateFields() != '') {
        this.$notification['warning']({
          message: '字段名校验失败',
          description: this.validateFields(),
          duration: 0
        })
        return
      }
      if (this.validateComponents().length > 0) {
        this.$notification['warning']({
          message: '以下组件中选项值重复！',
          description: this.validateComponents().join('，'),
          duration: 0
        })
        return
      }
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
      if (config.layout === 'colFormItem' || config.tag === 'fixedTable') {
        item.__vModel__ = ``
      } else {
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
      if (this.disabled) {
        return
      }
      if (this.formInfo.type == '浮动表单' && this.drawingList.length == 1) {
        this.$notification['warning']({
          message: '请勿重复添加组件!',
          description: '浮动表单无法重复添加组件',
          duration: 0
        })
        return
      }
      if (this.validateFields() != '') {
        this.$notification['warning']({
          message: '字段名校验失败',
          description: this.validateFields(),
          duration: 0
        })
        return
      }
      if (this.validateComponents().length > 0) {
        this.$notification['warning']({
          message: '以下组件中选项值重复！',
          description: this.validateComponents().join('，'),
          duration: 0
        })
        return
      }
      let clone = deepClone(item)
      clone = this.createIdAndKey(clone)
      list.push(clone)
      this.activeFormItem(clone)
    },

    drawingItemDelete(index, list) {
      if (this.disabled) {
        return
      }
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
      if (this.validateFields() != '') {
        this.$notification['warning']({
          message: '字段名校验失败',
          description: this.validateFields(),
          duration: 0
        })
        return
      }
      if (this.validateComponents().length > 0) {
        this.$notification['warning']({
          message: '以下组件中选项值重复！',
          description: this.validateComponents().join('，'),
          duration: 0
        })
        return
      }
      let formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
      this.$emit('view', formData)
    },

    save() {
      if (this.validateFields() != '') {
        this.$notification['warning']({
          message: '字段名校验失败',
          description: this.validateFields(),
          duration: 0
        })
        return
      }
      if (this.validateComponents().length > 0) {
        this.$notification['warning']({
          message: '以下组件中选项值重复！',
          description: this.validateComponents().join('，'),
          duration: 0
        })
        return
      }
      let formData = {
        fields: deepClone(this.drawingList),
        ...this.formConf
      }
      this.$emit('save', formData)
    },

    validateFields() {
      let valid = { empty: [], unique: [] }
      let field = {}
      this.drawingList.forEach(d => {
        if (field[d.__vModel__]) {
          field[d.__vModel__] = field[d.__vModel__] + 1
        } else {
          field[d.__vModel__] = 1
        }
      })
      this.drawingList.forEach(drawingItem => {
        if (drawingItem.__config__.tag != 'formDivider') {
          if (!drawingItem.__vModel__) {
            valid.empty.push(drawingItem.__config__.label)
          }
          if (field[drawingItem.__vModel__] > 1) {
            valid.unique.push(drawingItem.__config__.label)
          }
          if (drawingItem.__config__.layout === 'tableLayout') {
            let props = {}
            drawingItem.columns.forEach(d => {
              if (props[d.props]) {
                props[d.props] = props[d.props] + 1
              } else {
                props[d.props] = 1
              }
            })
            let emptyProps = drawingItem.columns.filter(item => item.props.trim() == '')
            if (emptyProps.length > 0) {
              let prefix = drawingItem.__config__.label ? drawingItem.__config__.label + ':' : drawingItem.__config__.label
              valid.empty.push(prefix + emptyProps.map(col => col.label).join(','))
            }
            let propUnique = ''
            drawingItem.columns.forEach(d => {
              if (d.props && props[d.props] > 1) {
                propUnique += d.label + ','
              }
            })
            if (propUnique != '') {
              propUnique = propUnique.substring(0, propUnique.length - 1)
              valid.unique.push(propUnique)
            }
          }
        }
      })
      if (valid.empty.length == 0 && valid.unique.length == 0) {
        return ''
      } else if (valid.empty.length == 0 && valid.unique.length != 0) {
        return `字段名重复：【${valid.unique.join(',')}】`
      } else if (valid.empty.length != 0 && valid.unique.length == 0) {
        return `字段名为空：【${valid.empty.join(',')}】`
      } else {
        return `字段名为空：【${valid.empty.join(',')}】;` + '\n' + `字段名重复:【${valid.unique.join(',')}】`
      }
    },

    validateComponents() {
      let valid = []
      // 校验选择组件选项重复
      this.drawingList.forEach(drawingItem => {
        if (drawingItem.__slot__) {
          let set = new Set(drawingItem.__slot__.options.map(opt => opt.label))
          if (set.size != drawingItem.__slot__.options.length) {
            valid.push(drawingItem.__config__.label)
          }
        } else if (drawingItem.__config__.layout === 'tableLayout') {
          let validFlag = []
          drawingItem.columns.forEach((col, index) => {
            if (col.type.__slot__) {
              let colSet = new Set(col.type.__slot__.options.map(opt => opt.label))
              if (colSet.size != col.type.__slot__.options.length) {
                validFlag.push(index + 1)
              }
            }
          })
          if (validFlag.length > 0) {
            valid.push(drawingItem.__config__.label + '第' + validFlag.join('，') + '列')
          }
        }
      })
      return valid
    },

    guide() {
      intro.setOptions({
        steps: [
          {
            title: '欢迎使用',
            intro: '<div style="text-align:center">如何使数据采集系统的表单配置功能</div>'
          },
          {
            element: document.querySelector('.left-main'),
            intro: '<div style="text-align:center">此处为表单配置的组件面板</div>'
          },
          {
            element: document.querySelector('.components-body'),
            intro: '<div style="text-align:center">点击或拖拽组件到中央操作区来生成一个表单项</div>'
          },
          {
            element: document.querySelector('.center-drag-item'),
            intro: '<div style="text-align:center"><p>拖拽组件可以调整顺序</p><p>点击组件来调整组件配置</p></div>'
          },
          {
            element: document.querySelector('#right-panel'),
            intro: '<div style="text-align:center">此处用于调整表单项配置和表单全局配置</div>'
          },
          {
            element: document.querySelector('.tinymce-div'),
            intro: '<div style="text-align:center">在此处填写表单的填报提示</div>'
          },
          {
            element: document.querySelector('#form-view'),
            intro: '<div style="text-align:center">点击实时预览设计的组件</div>'
          },
          {
            intro: `<div style="text-align:center;font-weight:600;font-size:18px">开始体验吧！</div>`
          }
        ]
      })
      intro
        // 确认完毕之后执行的事件
        .onbeforeexit(() => {
          if (this.isEmpty) {
            this.$emit('empty')
          }
        })
        .start()
    },

    isFirstUse() {
      let formCache = storage.get(FORM_CACHE)
      if (formCache && formCache.length > 0) {
        let flag = formCache.indexOf(this.currentUser.userId) == -1
        if (flag) {
          formCache.push(this.currentUser.userId)
          storage.set(FORM_CACHE, formCache)
          return true
        } else {
          return false
        }
      }
      storage.set(FORM_CACHE, [this.currentUser.userId])
      return true
    }
  }
}
</script>

<style lang="less">
@import './styles/home';
.tinymce-div {
  h4 {
    font-weight: 600;
    font-size: 18px;
  }
  margin-bottom: 24px;
}
</style>
