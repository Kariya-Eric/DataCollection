<template>
  <div>
    <a-tabs v-model="currentTab" class="right-header">
      <a-tab-pane key="field" tab="组件属性" />
      <a-tab-pane key="form" tab="表单属性" />
    </a-tabs>
    <div class="right-main">
      <a-form-model v-show="currentTab === 'field' && showField" size="small" label-width="90px">
        <a-form-model-item v-if="activeData.__config__.changeTag" label="组件类型">
          <a-select v-model="activeData.__config__.tagIcon" placeholder="请选择组件类型" :style="{ width: '100%' }" @change="tagChange">
            <a-select-opt-group v-for="group in tagList" :key="group.label" :label="group.label">
              <a-select-option v-for="item in group.options" :key="item.__config__.label" :value="item.__config__.tagIcon">
                <svg-icon class="node-icon" :icon-class="item.__config__.tagIcon" />
                <span> {{ item.__config__.label }}</span>
              </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag == 'formDivider'" label="组件名">
          {{ activeData.__config__.label }}
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.label !== undefined && activeData.__config__.tag !== 'formDivider'" label="标题">
          <a-input v-model="activeData.__config__.label" placeholder="请输入标题" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.placeholder !== undefined" label="占位提示">
          <el-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
        </a-form-model-item>
        <a-form-model-item label="注释" v-if="activeData.comment !== undefined">
          <a-textarea :rows="4" placeholder="请输入组件注释" v-model="activeData.comment" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.span !== undefined && activeData.__config__.tag !== 'formDivider'" label="组件宽度">
          <a-slider v-model="activeData.__config__.span" :min="1" :max="24" :marks="{ 12: '' }" @change="spanChange"></a-slider>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.style && activeData.style.width !== undefined" label="输入框宽度">
          <a-slider v-model="inputWidth" :marks="{ 50: '' }"></a-slider>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-input-number'" label="小数位数">
          <a-input-number v-model="activeData.precision" :min="0" placeholder="小数位数" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-input-number'" label="最小值">
          <a-input-number v-model="activeData.min" placeholder="最小值" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-input-number'" label="最大值">
          <a-input-number v-model="activeData.max" placeholder="最大值" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-checkbox-group'" label="至少应选">
          <a-input-number :value="activeData.min" :min="0" placeholder="至少应选" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-checkbox-group'" label="最多可选">
          <a-input-number :value="activeData.max" :min="0" placeholder="最多可选" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'formAddress'" label="地址格式">
          <a-select v-model="activeData.type" style="width: 100%">
            <a-select-option value="国/省（直辖市、自治区）/市">国/省（直辖市、自治区）/市</a-select-option>
            <a-select-option value="省（直辖市、自治区）/市/区-详细地址">省（直辖市、自治区）/市/区-详细地址</a-select-option>
            <a-select-option value="省（直辖市、自治区）/市/区">省（直辖市、自治区）/市/区</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.format !== undefined" label="时间格式">
          <a-select v-model="activeData.format" @change="changeTimeFormat" style="width: 100%">
            <a-select-option value="yyyy">年（yyyy）</a-select-option>
            <a-select-option value="yyyy-MM">年-月（yyyy-MM）</a-select-option>
            <a-select-option value="yyyyMM">年月（yyyyMM）</a-select-option>
          </a-select>
        </a-form-model-item>
        <template v-if="['a-checkbox-group', 'a-radio-group', 'a-select'].indexOf(activeData.__config__.tag) > -1">
          <a-divider>选项</a-divider>
          <draggable :list="activeData.__slot__.options" :animation="340" group="selectItem" handle=".option-drag">
            <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
              <div class="select-line-icon option-drag">
                <a-icon type="pic-left" />
              </div>
              <a-input v-model="item.label" placeholder="选项名" />
              <div class="close-btn select-line-icon">
                <a-icon type="minus-circle" @click="delSelectItem(index)" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px">
            <a-button style="padding-bottom: 0" icon="plus-circle" type="link" @click="addSelectItem"> 添加选项 </a-button>
            <a style="margin-left: 96px">设置选项来源</a>
          </div>
          <a-divider />
        </template>
        <a-form-model-item v-if="activeData.__config__.tag === 'formPhone'" label="支持固话">
          <a-switch v-model="activeData.isMobile" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-input'" label="禁止汉字">
          <a-switch v-model="activeData.allowChar" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.showLabel !== undefined && activeData.__config__.tag !== 'formDivider'" label="显示标签">
          <a-switch v-model="activeData.__config__.showLabel" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" label="能否搜索">
          <a-switch v-model="activeData.filterable" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" label="是否多选">
          <a-switch v-model="activeData.multiple" @change="multipleChange" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.required !== undefined" label="是否必填">
          <a-switch v-model="activeData.__config__.required" />
        </a-form-model-item>
      </a-form-model>

      <!-- 表单属性 -->
      <a-form-model v-show="currentTab === 'form'" size="small" label-width="100px">
        <a-form-model-item label="表单名称">
          <a-input v-model="baseInfo.name" />
        </a-form-model-item>
        <a-form-model-item label="表单大类">
          <a-select v-model="baseInfo.formCategories" style="width: 100%">
            <a-select-option v-for="item in baseInfo.listCategories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="统计时间类型">
          <a-select v-model="baseInfo.collectTimeType" style="width: 100%">
            <a-select-option value="时点">时点</a-select-option>
            <a-select-option value="学年">学年</a-select-option>
            <a-select-option value="自然年">自然年</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单类型">
          <a-input v-model="baseInfo.type" disabled />
        </a-form-model-item>
        <a-form-model-item label="表单尺寸">
          <a-radio-group v-model="formConf.size">
            <a-radio-button value="medium"> 中等 </a-radio-button>
            <a-radio-button value="small"> 较小 </a-radio-button>
            <a-radio-button value="mini"> 迷你 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="标签对齐">
          <a-radio-group v-model="formConf.labelAlign">
            <a-radio-button value="left"> 左对齐 </a-radio-button>
            <a-radio-button value="right"> 右对齐 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="标签宽度">
          <a-slider v-model="formConf.labelCol.span" :min="2" :max="23" @change="labelChange"></a-slider>
        </a-form-model-item>

        <template v-if="baseInfo.type == '固定表单'">
          <el-divider>表单显隐规则</el-divider>
          <div v-for="(item, index) in formConf.componentsVisible" :key="index" class="reg-item">
            <span class="close-btn">
              <a-icon :style="{ fontSize: '16px' }" type="close-circle" theme="twoTone" two-tone-color="#ff4d4f" @click="delRule(index)" />
            </span>
            <a @click="editRule(index)">表单显隐藏规则-第{{ index + 1 }}条</a>
          </div>
          <div style="margin-left: 20px">
            <a-button icon="plus-circle" type="link" @click="addRule"> 添加规则 </a-button>
          </div>
          <logic-dialog ref="logicDialog" :drawing-list="drawingList" :form-conf="formConf" />
        </template>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import LogicDialog from './logic-dialog.vue'
import { inputComponentsFix, selectComponentsFix } from '../config/config_fix'
import RightPanelTable from './right-panel-table.vue'
export default {
  name: 'RightPanel',
  components: {
    draggable,
    RightPanelTable,
    LogicDialog
  },
  props: ['showField', 'activeData', 'formConf', 'baseInfo', 'drawingList'],
  data() {
    return {
      currentTab: 'field'
    }
  },
  computed: {
    inputWidth: {
      get() {
        if (this.activeData.style != undefined) {
          return parseInt(this.activeData.style.width)
        }
        return 0
      },
      set(val) {
        this.$set(this.activeData, 'style', { width: val + '%' })
      }
    },
    tagList() {
      return [
        {
          label: '输入型组件',
          options: inputComponentsFix
        },
        {
          label: '选择型组件',
          options: selectComponentsFix
        }
      ]
    }
  },

  methods: {
    // start
    changeTimeFormat(val) {
      this.activeData['value-format'] = val
      if (val === 'yyyy-MM') {
        this.$set(this.activeData, 'dateType', 'month')
      } else if (val === 'yyyyMM') {
        this.$set(this.activeData, 'dateType', 'month')
      } else {
        this.$set(this.activeData, 'dateType', 'year')
      }
    },

    addRule() {
      this.$refs.logicDialog.show()
    },

    delRule(index) {
      this.formConf.componentsVisible.splice(index, 1)
    },

    editRule(index) {
      this.$refs.logicDialog.show(index)
    },
    // end
    addSelectItem() {
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = i + 1
      }
      this.activeData.__slot__.options.push({
        label: '选项',
        value: this.activeData.__slot__.options.length + 1
      })
    },
    delSelectItem(index) {
      this.activeData.__slot__.options.splice(index, 1)
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = i + 1
      }
    },
    spanChange(val) {
      this.$set(this.formConf, 'span', val)
    },
    labelChange(val) {
      let wrapperCol = 24 - val
      this.$set(this.formConf, 'labelCol', { span: val, offset: 0 })
      this.$set(this.formConf, 'wrapperCol', { span: wrapperCol, offset: 0 })
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : '')
    },
    dragEnd(obj) {
      if (obj.oldIndex + 1 == this.activeData.selectedCol) {
        this.activeData.selectedCol = obj.newIndex + 1
      }
    },

    tagChange(tagIcon) {
      let target = inputComponentsFix.find(item => item.__config__.tagIcon === tagIcon)
      if (!target) target = selectComponentsFix.find(item => item.__config__.tagIcon === tagIcon)
      this.$emit('tag-change', target)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 10px;
}
.right-header {
  position: relative;
  height: 64px;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 64px;
  background: #fff;
  padding: 15px;
}
.right-main {
  height: calc(100vh - 64px - 30px);
  overflow-y: auto;
  margin: 10px 10px 0;
  padding: 5px;
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #e23322;
  }
  & .a-input + .a-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #2f68bd;
}
.select-line-icon {
  line-height: 32px;
  font-size: 22px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
}
.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}
</style>
