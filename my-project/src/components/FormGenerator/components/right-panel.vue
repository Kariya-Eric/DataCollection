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
          <a-select
            v-model="activeData.__config__.tagIcon"
            placeholder="请选择组件类型"
            :style="{ width: '100%' }"
            @change="tagChange"
            :getPopupContainer="target => target.parentNode"
            :disabled="disabled"
          >
            <a-select-opt-group v-for="group in tagList" :key="group.label">
              <span slot="label">{{ group.label }}</span>
              <a-select-option v-for="item in group.options" :key="item.__config__.label" :value="item.__config__.tagIcon">{{ item.__config__.label }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag == 'formDivider'" label="组件名">
          {{ activeData.__config__.label }}
        </a-form-model-item>

        <a-form-model-item
          v-if="activeData.__config__.label !== undefined && activeData.__config__.tag !== 'formDivider' && activeData.__config__.tag !== 'floatTable'"
          label="字段名"
        >
          <a-input v-model="activeData.__vModel__" placeholder="字段名只能包含数字字母和汉字" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.label !== undefined && activeData.__config__.tag !== 'formDivider'" label="标题">
          <a-input v-model="activeData.__config__.label" placeholder="请输入标题" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.placeholder !== undefined" label="占位提示">
          <a-input v-model="activeData.placeholder" placeholder="请输入占位提示" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item label="注释" v-if="activeData.comment !== undefined">
          <a-textarea :rows="4" placeholder="请输入组件注释" size="small" v-model="activeData.comment" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.span !== undefined && activeData.__config__.tag !== 'formDivider'" label="组件宽度">
          <a-slider :disabled="disabled" v-model="activeData.__config__.span" :min="1" :max="24" :marks="{ 12: '12' }" @change="spanChange"></a-slider>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.labelCol !== undefined && activeData.__config__.tag !== 'formDivider'" label="标签宽度">
          <a-slider :disabled="disabled" v-model="activeData.__config__.labelCol.span" :min="1" :max="23" :marks="{ 12: '12' }" @change="changeLabelWidth"></a-slider>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.style && activeData.style.width !== undefined" label="输入框宽度">
          <a-slider :disabled="disabled" v-model="inputWidth" :step="10" :marks="{ 50: '50%' }"></a-slider>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.tag === 'a-input-number'" label="小数位数">
          <a-input-number :disabled="disabled" v-model="activeData.precision" :min="0" placeholder="小数位数" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-input-number'" label="最小值">
          <a-input-number :disabled="disabled" v-model="activeData.min" placeholder="最小值" @change="handleChangeMin" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-input-number'" label="最大值">
          <a-input-number :disabled="disabled" v-model="activeData.max" placeholder="最大值" @change="handleChangeMax" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.tag === 'formAddress'" label="地址格式">
          <a-select v-model="activeData.type" :getPopupContainer="target => target.parentNode" :disabled="disabled">
            <a-select-option value="国/省（直辖市、自治区）/市">国/省（直辖市、自治区）/市</a-select-option>
            <a-select-option value="省（直辖市、自治区）/市/区-详细地址" title="省（直辖市、自治区）/市/区-详细地址">省（直辖市、自治区）/市/区-详细地址</a-select-option>
            <a-select-option value="省（直辖市、自治区）/市/区">省（直辖市、自治区）/市/区</a-select-option>
          </a-select>
        </a-form-model-item>

        <a-form-model-item v-if="activeData.format !== undefined" label="时间格式">
          <a-select v-model="activeData.format" @change="changeTimeFormat" :getPopupContainer="target => target.parentNode" :disabled="disabled">
            <a-select-option value="yyyy">年（YYYY）</a-select-option>
            <a-select-option value="yyyy-MM">年-月（YYYY-MM）</a-select-option>
            <a-select-option value="yyyyMM">年月（YYYYMM）</a-select-option>
          </a-select>
        </a-form-model-item>

        <template v-if="['a-checkbox-group', 'a-radio-group', 'a-select'].indexOf(activeData.__config__.tag) > -1">
          <a-divider>选项</a-divider>
          <draggable
            :list="activeData.__slot__.options"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
            :disabled="disabled || (activeData.source != undefined && activeData.source != false)"
          >
            <div v-for="(item, index) in activeData.__slot__.options" :key="index" class="select-item">
              <div class="select-line-icon option-drag">
                <a-icon type="unordered-list" style="font-size: 16px" />
              </div>
              <a-input
                v-model="item.label"
                placeholder="选项名"
                :disabled="disabled || (activeData.source != undefined && activeData.source != false)"
                @change="e => changeOptionLabel(e, index)"
              />
              <div class="close-btn select-line-icon" @click="delSelectItem(index)" v-if="!activeData.source && !disabled">
                <a-icon type="minus-circle" style="font-size: 16px" />
              </div>
            </div>
          </draggable>
          <div style="margin-top: 8px">
            <a-button
              v-if="activeData.source == undefined || activeData.source == false"
              :disabled="disabled"
              style="padding-bottom: 0"
              icon="plus-circle"
              type="link"
              @click="addSelectItem"
            >
              添加选项
            </a-button>
            <a-button :disabled="disabled" style="padding-bottom: 0; font-size: 11px" type="link" @click="$refs.optionModal.show(activeData)"> 设置选项来源 </a-button>
            <a-popconfirm title="确认要清除选项来源吗？" @confirm="clearOption" placement="left" v-if="!disabled">
              <a-button style="padding-bottom: 0; font-size: 11px; color: red" type="link"> 清空选项来源 </a-button>
            </a-popconfirm>
          </div>
          <a-divider />
        </template>

        <a-form-model-item v-if="activeData.__config__.tag === 'formPhone'" label="支持固话">
          <a-switch v-model="activeData.isMobile" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.tag === 'a-input' || activeData.__config__.tag === 'a-textarea'" label="禁止汉字">
          <a-switch v-model="activeData.allowChar" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.showLabel !== undefined && activeData.__config__.tag !== 'formDivider'" label="显示标签">
          <a-switch v-model="activeData.__config__.showLabel" :disabled="disabled" />
        </a-form-model-item>

        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" label="能否搜索">
          <a-switch v-model="activeData.showSearch" :disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.tag === 'a-select'" label="是否多选">
          <a-switch :value="activeData.mode === 'default'" @change="multipleChange" :disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item v-if="activeData.__config__.required !== undefined" label="是否必填">
          <a-switch v-model="activeData.__config__.required" :disabled="disabled" />
        </a-form-model-item>

        <!-- 自定义组件start -->
        <template v-if="activeData.__config__.tag === 'formDivider'">
          <a-divider>分割线设置</a-divider>
          <a-form-model-item label="标题">
            <a-input v-model="activeData.title" :disabled="disabled" />
          </a-form-model-item>
          <a-form-model-item label="标题位置">
            <a-radio-group v-model="activeData.orientation" button-style="solid" :disabled="disabled">
              <a-radio-button value="left"> 居左 </a-radio-button>
              <a-radio-button value="center"> 居中 </a-radio-button>
              <a-radio-button value="right"> 居右 </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="字体大小">
            <a-slider :disabled="disabled" v-model="activeData.fontSize" :min="12" :max="30" :marks="{ 16: '16', 24: '24' }"></a-slider>
          </a-form-model-item>
        </template>

        <right-panel-table v-if="activeData.__config__.layout === 'tableLayout'" :activeData="activeData" :disabled="disabled" />
        <!-- 自定义组件end -->
      </a-form-model>

      <!-- 表单属性 -->
      <a-form-model v-show="currentTab === 'form'" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-form-model-item label="表单名称">
          <a-input v-model="baseInfo.name" :disabled="disabled" />
        </a-form-model-item>
        <a-form-model-item label="表单大类">
          <a-select v-model="baseInfo.formCategories" :disabled="disabled" placeholder="请选择表单大类">
            <a-select-option v-for="item in baseInfo.listCategories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="统计时间类型"
          :labelCol="{ style: 'width: 110px; display: inline-block;' }"
          :wrapperCol="{ style: 'width: calc(100% - 121px); display: inline-block;' }"
        >
          <a-select v-model="baseInfo.collectTimeType" :disabled="disabled">
            <a-select-option value="时点">时点</a-select-option>
            <a-select-option value="学年">学年</a-select-option>
            <a-select-option value="自然年">自然年</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单类型">
          <a-input v-model="baseInfo.type" disabled />
        </a-form-model-item>
        <a-form-model-item label="标签对齐">
          <a-radio-group v-model="formConf.labelAlign" button-style="solid" :disabled="disabled">
            <a-radio-button value="left"> 左对齐 </a-radio-button>
            <a-radio-button value="right"> 右对齐 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>

        <template v-if="baseInfo.type == '固定表单'">
          <a-divider>表单显隐规则</a-divider>
          <div v-for="(item, index) in formConf.componentsVisible" :key="index" class="reg-item">
            <span class="close-btn" v-if="!disabled">
              <a-icon type="close" @click="delRule(index)" />
            </span>
            <a @click="editRule(index)">表单显隐藏规则-第{{ index + 1 }}条</a>
          </div>
          <div>
            <a-button icon="plus-circle" type="link" @click="addRule" :disabled="disabled"> 添加规则 </a-button>
          </div>
          <logic-modal ref="logicModal" :drawing-list="drawingList" :form-conf="formConf" :disabled="disabled" />
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
import debounce from 'lodash/debounce'
export default {
  name: 'RightPanel',
  components: {
    draggable,
    RightPanelTable,
    LogicModal,
    OptionModal
  },
  props: ['showField', 'activeData', 'formConf', 'baseInfo', 'drawingList', 'disabled'],
  data() {
    return {
      currentTab: 'field',
      labelCol: { style: 'width: 80px; display: inline-block;vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 80px); display: inline-block;' },
      debounceChangeMax: debounce(this.changeMax, 500),
      debounceChangeMin: debounce(this.changeMin, 500)
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
  mounted() {
    if (this.baseInfo.type == '浮动表单') {
      this.activeData.__config__.tag = 'floatTable'
    }
  },
  methods: {
    // start
    clearOption() {
      this.$set(this.activeData.__slot__, 'options', [
        {
          label: '选项一',
          value: '选项一'
        },
        {
          label: '选项二',
          value: '选项二'
        }
      ])
      this.activeData.source = undefined
    },

    setOption(options, optionInfo) {
      this.$set(
        this.activeData.__slot__,
        'options',
        options.map(opt => {
          let { name, id } = opt
          return { label: name, value: id }
        })
      )
      this.activeData.source = JSON.parse(JSON.stringify(optionInfo))
    },

    changeTimeFormat(val) {
      if (val === 'yyyy-MM') {
        this.$set(this.activeData, 'mode', 'month')
      } else if (val === 'yyyyMM') {
        this.$set(this.activeData, 'mode', 'month')
      } else {
        this.$set(this.activeData, 'mode', 'year')
      }
    },

    addRule() {
      this.$refs.logicModal.show()
    },

    delRule(index) {
      if (this.disabled) {
        return
      }
      this.formConf.componentsVisible.splice(index, 1)
    },

    editRule(index) {
      if (this.disabled) {
        return
      }
      this.$refs.logicModal.show(index)
    },

    changeLabelWidth(val) {
      this.activeData.__config__.wrapperCol.span = 24 - val
    },

    changeOptionLabel(e, index) {
      let label = e.target.value
      this.activeData.__slot__.options[index].value = label
    },

    handleChangeMax(value) {
      this.activeData.max = value
      this.debounceChangeMax(this.activeData.max)
    },
    handleChangeMin(value) {
      this.activeData.min = value
      this.debounceChangeMin(this.activeData.min)
    },

    changeMin: debounce(function (value) {
      if (typeof value == 'number' && this.activeData.max != undefined && this.activeData.max < value) {
        this.$notification['warning']({
          message: '请检查',
          description: '组件最小值不能大于组件最大值',
          duration: 0,
          onClose: () => {
            this.activeData.min = undefined
          }
        })
      } else {
        this.activeData.min = value
      }
    }),

    changeMax: debounce(function (value) {
      if (typeof value == 'number' && this.activeData.min != undefined && this.activeData.min > value) {
        this.$notification['warning']({
          message: '请检查',
          description: '组件最大值不能小于组件最小值',
          duration: 0,
          onClose: () => {
            this.activeData.max = undefined
          }
        })
      } else {
        this.activeData.max = value
      }
    }),
    // end
    addSelectItem() {
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = this.activeData.__slot__.options[i].label
      }
      this.activeData.__slot__.options.push({
        label: '选项',
        value: '选项'
      })
    },

    delSelectItem(index) {
      if (this.disabled) {
        return
      }
      if (this.activeData.__slot__.options.length == 1) {
        this.$message.warning('至少需要保留一条选项！')
        return
      }
      this.activeData.__slot__.options.splice(index, 1)
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = this.activeData.__slot__.options[i].label
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
  max-height: calc(100vh - 220px);
  margin: 10px 4px 0 0;
  padding: 4px 8px 4px 4px;
  overflow-y: auto;
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
/deep/.ant-select-dropdown {
  top: 32px !important;
}
</style>
