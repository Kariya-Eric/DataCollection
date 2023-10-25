<template>
  <div>
    <a-tabs v-model="currentTab" class="right-header" id="form-config">
      <a-tab-pane key="field" tab="组件属性" />
      <a-tab-pane key="form" tab="表单属性" />
    </a-tabs>
    <div class="right-main">
      <!-- 组件属性 -->
      <a-form-model v-if="currentTab === 'field' && showField" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-model-item v-if="activeData.__config__.changeTag" label="组件类型">
          <a-select v-model="activeData.__config__.tagIcon" placeholder="请选择组件类型" :style="{ width: '100%' }" @change="tagChange">
            <a-select-opt-group v-for="group in tagList" :key="group.label">
              <span slot="label">{{ group.label }}</span>
              <a-select-option v-for="item in group.options" :key="item.__config__.label" :value="item.__config__.tagIcon">{{ item.__config__.label }}</a-select-option>
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
          <a-input v-model="activeData.placeholder" placeholder="请输入占位提示" />
        </a-form-model-item>

        <a-form-model-item label="注释" v-if="activeData.comment !== undefined">
          <a-textarea :rows="4" placeholder="请输入组件注释" size="small" v-model="activeData.comment" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.span !== undefined && activeData.__config__.tag !== 'formDivider'" label="组件宽度">
          <a-slider v-model="activeData.__config__.span" :min="1" :max="24" :marks="{ 12: '12' }" @change="spanChange"></a-slider>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.labelCol !== undefined && activeData.__config__.tag !== 'formDivider'" label="标签宽度">
          <a-slider v-model="activeData.__config__.labelCol.span" :min="1" :max="23" :marks="{ 12: '12' }" @change="changeLabelWidth"></a-slider>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.style && activeData.style.width !== undefined" label="输入框宽度">
          <a-slider v-model="inputWidth" :step="10" :marks="{ 50: '50%' }"></a-slider>
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

        <a-form-model-item v-if="activeData.__config__.tag === 'formAddress'" label="地址格式">
          <a-select v-model="activeData.type">
            <a-select-option value="国/省（直辖市、自治区）/市">国/省（直辖市、自治区）/市</a-select-option>
            <a-select-option value="省（直辖市、自治区）/市/区-详细地址" title="省（直辖市、自治区）/市/区-详细地址">省（直辖市、自治区）/市/区-详细地址</a-select-option>
            <a-select-option value="省（直辖市、自治区）/市/区">省（直辖市、自治区）/市/区</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.format !== undefined" label="时间格式">
          <a-select v-model="activeData.format" @change="changeTimeFormat">
            <a-select-option value="YYYY">年（yyyy）</a-select-option>
            <a-select-option value="YYYY-MM">年-月（yyyy-MM）</a-select-option>
            <a-select-option value="YYYYMM">年月（yyyyMM）</a-select-option>
          </a-select>
        </a-form-model-item>

        <template v-if="['a-checkbox-group', 'a-radio-group', 'a-select'].indexOf(activeData.__config__.tag) > -1">
          <a-divider>选项</a-divider>
          <draggable :list="activeData.__slot__.options" :animation="340" group="selectItem" handle=".option-drag">
            <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
              <div class="select-line-icon option-drag">
                <a-icon type="unordered-list" style="font-size: 18px" />
              </div>
              <a-input v-model="item.label" placeholder="选项名" />
              <div class="close-btn select-line-icon" @click="delSelectItem(index)">
                <a-icon type="delete" style="font-size: 18px" />
              </div>
            </div>
          </draggable>
          <div style="margin-top: 8px">
            <a-button style="padding-bottom: 0" icon="plus-circle" type="link" @click="addSelectItem"> 添加选项 </a-button>
            <a style="margin-left: 96px" @click="$refs.optionModal.show()">设置选项来源</a>
          </div>
          <a-divider />
        </template>

        <a-form-model-item v-if="activeData.__config__.tag === 'formPhone'" label="支持固话">
          <a-switch v-model="activeData.isMobile" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.tag === 'a-input' || activeData.__config__.tag === 'a-textarea'" label="禁止汉字">
          <a-switch v-model="activeData.allowChar" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.showLabel !== undefined && activeData.__config__.tag !== 'formDivider'" label="显示标签">
          <a-switch v-model="activeData.__config__.showLabel" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" label="能否搜索">
          <a-switch v-model="activeData.showSearch" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" label="是否多选">
          <a-switch :value="activeData.mode === 'default'" @change="multipleChange" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.required !== undefined" label="是否必填">
          <a-switch v-model="activeData.__config__.required" />
        </a-form-model-item>

        <!-- 自定义组件start -->
        <template v-if="activeData.__config__.tag === 'formDivider'">
          <a-divider>分割线设置</a-divider>
          <a-form-model-item label="标题">
            <a-input v-model="activeData.title" />
          </a-form-model-item>
          <a-form-model-item label="标题位置">
            <a-radio-group v-model="activeData.orientation" button-style="solid">
              <a-radio-button value="left"> 居左 </a-radio-button>
              <a-radio-button value="center"> 居中 </a-radio-button>
              <a-radio-button value="right"> 居右 </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="字体大小">
            <a-slider v-model="activeData.fontSize" :min="12" :max="30" :marks="{ 16: '16', 24: '24' }"></a-slider>
          </a-form-model-item>
        </template>

        <right-panel-table v-if="activeData.__config__.layout === 'tableLayout'" :activeData="activeData" />
        <!-- 自定义组件end -->
      </a-form-model>

      <!-- 表单属性 -->
      <a-form-model v-show="currentTab === 'form'" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-model-item label="表单名称">
          <a-input v-model="baseInfo.name" />
        </a-form-model-item>
        <a-form-model-item label="表单大类">
          <a-select v-model="baseInfo.formCategories">
            <a-select-option v-for="item in baseInfo.listCategories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="统计时间类型"
          :labelCol="{ style: 'width: 110px; display: inline-block;' }"
          :wrapperCol="{ style: 'width: calc(100% - 121px); display: inline-block;' }"
        >
          <a-select v-model="baseInfo.collectTimeType">
            <a-select-option value="时点">时点</a-select-option>
            <a-select-option value="学年">学年</a-select-option>
            <a-select-option value="自然年">自然年</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单类型">
          <a-input v-model="baseInfo.type" disabled />
        </a-form-model-item>
        <a-form-model-item label="标签对齐">
          <a-radio-group v-model="formConf.labelAlign" button-style="solid">
            <a-radio-button value="left"> 左对齐 </a-radio-button>
            <a-radio-button value="right"> 右对齐 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>

        <template v-if="baseInfo.type == '固定表单'">
          <a-divider>表单显隐规则</a-divider>
          <div v-for="(item, index) in formConf.componentsVisible" :key="index" class="reg-item">
            <span class="close-btn">
              <a-icon type="close" @click="delRule(index)" />
            </span>
            <a @click="editRule(index)">表单显隐藏规则-第{{ index + 1 }}条</a>
          </div>
          <div>
            <a-button icon="plus-circle" type="link" @click="addRule"> 添加规则 </a-button>
          </div>
          <logic-modal ref="logicModal" :drawing-list="drawingList" :form-conf="formConf" />
        </template>
      </a-form-model>
    </div>
    <option-modal ref="optionModal" @setOption="setOption" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import LogicModal from './logic-modal.vue'
import { inputComponentsFix, selectComponentsFix } from '../config/config_fix'
import RightPanelTable from './right-panel-table.vue'
import OptionModal from './option-modal.vue'
export default {
  name: 'RightPanel',
  components: {
    draggable,
    RightPanelTable,
    LogicModal,
    OptionModal
  },
  props: ['showField', 'activeData', 'formConf', 'baseInfo', 'drawingList'],
  data() {
    return {
      currentTab: 'field',
      labelCol: { style: 'width: 80px; display: inline-block;vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 80px); display: inline-block;' }
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
    setOption(options) {
      this.$set(this.activeData.__slot__, 'options', options)
    },

    changeTimeFormat(val) {
      if (val === 'YYYY-MM') {
        this.$set(this.activeData, 'mode', 'month')
      } else if (val === 'YYYYMM') {
        this.$set(this.activeData, 'mode', 'month')
      } else {
        this.$set(this.activeData, 'mode', 'year')
      }
    },

    addRule() {
      this.$refs.logicModal.show()
    },

    delRule(index) {
      this.formConf.componentsVisible.splice(index, 1)
    },

    editRule(index) {
      this.$refs.logicModal.show(index)
    },

    changeLabelWidth(val) {
      this.activeData.__config__.wrapperCol.span = 24 - val
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
      if (this.activeData.__slot__.options.length == 1) {
        this.$message.warning('至少需要保留一条选项！')
        return
      }
      this.activeData.__slot__.options.splice(index, 1)
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = i + 1
      }
    },
    spanChange(val) {
      this.$set(this.formConf, 'span', val)
    },

    labelChange(val) {
      this.$set(this.formConf, 'labelWidth', val)
    },

    multipleChange(val) {
      this.$set(this.activeData, 'mode', val ? 'multiple' : 'default')
      this.$set(this.activeData.__config__, 'defaultValue', val ? [] : undefined)
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
/deep/.ant-tabs-nav-wrap {
  text-align: center;
}
.right-header {
  position: relative;
  height: 48px;
  overflow: hidden;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  line-height: 64px;
  background: #fff;
  padding: 0px;
}
.right-main {
  height: calc(100vh - 130px);
  overflow-y: auto;
  margin: 10px 10px 0;
  padding: 4px 8px 4px 8px;
}
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    font-size: 18px;
    margin-left: 8px;
    cursor: pointer;
    color: #f56c6c;
  }
  & .a-input + .a-input {
    margin-left: 4px;
  }
}
.select-item + .select-item {
  margin-top: 4px;
}
.select-item.sortable-chosen {
  border: 1px dashed #409eff;
}
.select-line-icon {
  line-height: 32px;
  font-size: 18px;
  padding: 0 4px;
  color: #777;
}
.option-drag {
  cursor: move;
  margin-right: 8px;
}

.node-label {
  font-size: 14px;
}
.node-icon {
  color: #bebfc3;
}

.reg-item {
  padding: 12px 6px;
  background: #f8f8f8;
  position: relative;
  border-radius: 4px;
  .close-btn {
    position: absolute;
    right: -5px;
    top: -5px;
    display: block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    color: #fff;
    text-align: center;
    z-index: 1;
    cursor: pointer;
    font-size: 12px;
    &:hover {
      background: rgba(210, 23, 23, 0.5);
    }
  }
  & + .reg-item {
    margin-top: 18px;
  }
}
</style>
