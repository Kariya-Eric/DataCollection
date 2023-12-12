<template>
  <div>
    <div>
      <template>
        <a-divider>列名 - 属性</a-divider>
        <draggable :list="activeData.columns" :animation="340" group="selectItem" handle=".option-drag" @end="dragEnd" :disabled="disabled">
          <div v-for="item in activeData.columns" :key="item.key" class="select-item">
            <div class="select-line-icon option-drag">
              <a-icon type="unordered-list" style="font-size: 16px" />
            </div>
            <a-input v-model="item.label" :disabled="disabled" />
            <div class="close-btn select-line-icon" v-if="!disabled">
              <a-icon type="minus-circle" style="font-size: 16px" @click="delCol(item.key)" />
            </div>
          </div>
        </draggable>
        <div style="margin-top: 8px">
          <a-button :disabled="disabled" style="padding-bottom: 0" icon="plus-circle" type="link" @click="addCol"> 添加列 </a-button>
        </div>
      </template>
    </div>
    <template v-if="activeData.selectedCol !== -1">
      <a-divider>已选中 : 第{{ activeData.selectedCol }}列</a-divider>
      <a-form-model-item label="类型">
        <a-select
          v-model="activeData.columns[activeData.selectedCol - 1].type.__config__.tag"
          @change="tagChange"
          :getPopupContainer="target => target.parentNode"
          :disabled="disabled"
        >
          <a-select-option value="a-input">单行文本</a-select-option>
          <a-select-option value="a-textarea">多行文本</a-select-option>
          <a-select-option value="a-input-number">数字</a-select-option>
          <a-select-option value="formMail">邮箱</a-select-option>
          <a-select-option value="formPhone">电话</a-select-option>
          <a-select-option value="formLink">链接</a-select-option>
          <a-select-option value="formAddress">地址</a-select-option>
          <a-select-option value="a-select">下拉选择</a-select-option>
          <a-select-option value="dc-date">日期选择</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'formPhone'" label="支持固话">
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.isMobile" :disabled="disabled" />
      </a-form-model-item>
      <a-form-model-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-input' || activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-textarea'
        "
        label="禁止汉字"
      >
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.allowChar" :disabled="disabled" />
      </a-form-model-item>
      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-input-number'" label="小数位数">
        <a-input-number v-model="activeData.columns[activeData.selectedCol - 1].type.precision" :min="0" placeholder="小数位数" :disabled="disabled" />
      </a-form-model-item>
      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-input-number'" label="最小值">
        <a-input-number v-model="activeData.columns[activeData.selectedCol - 1].type.min" placeholder="最小值" :disabled="disabled" />
      </a-form-model-item>
      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-input-number'" label="最大值">
        <a-input-number v-model="activeData.columns[activeData.selectedCol - 1].type.max" placeholder="最大值" :disabled="disabled" />
      </a-form-model-item>

      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'formAddress'" label="地址格式">
        <a-select v-model="activeData.columns[activeData.selectedCol - 1].type.type" :getPopupContainer="target => target.parentNode" :disabled="disabled">
          <a-select-option value="国/省（直辖市、自治区）/市">国/省（直辖市、自治区）/市</a-select-option>
          <a-select-option value="省（直辖市、自治区）/市/区-详细地址" title="省（直辖市、自治区）/市/区-详细地址">省（直辖市、自治区）/市/区-详细地址</a-select-option>
          <a-select-option value="省（直辖市、自治区）/市/区">省（直辖市、自治区）/市/区</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'dc-date'" label="时间格式">
        <a-select
          v-model="activeData.columns[activeData.selectedCol - 1].type.format"
          @change="val => changeTimeFormat(val, activeData.columns[activeData.selectedCol - 1].type)"
          :getPopupContainer="target => target.parentNode"
          :disabled="disabled"
        >
          <a-select-option value="yyyy">年（yyyy）</a-select-option>
          <a-select-option value="yyyy-MM">年-月（yyyy-MM）</a-select-option>
          <a-select-option value="yyyyMM">年月（yyyyMM）</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-select'" label="能否搜索">
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.showSearch" :disabled="disabled" />
      </a-form-model-item>

      <a-form-model-item v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-select'" label="能否多选">
        <a-switch :value="activeData.columns[activeData.selectedCol - 1].type.mode === 'default'" @change="changeMultiple" :disabled="disabled" />
      </a-form-model-item>

      <a-form-model-item label="是否必填">
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.__config__.required" :disabled="disabled" />
      </a-form-model-item>

      <a-form-model-item label="注释">
        <a-textarea
          :rows="4"
          :placeholder="`请输入${activeData.columns[activeData.selectedCol - 1].label}注释`"
          v-model="activeData.columns[activeData.selectedCol - 1].type.comment"
          :disabled="disabled"
        />
      </a-form-model-item>

      <template v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.tag === 'a-select'">
        <a-divider>选项</a-divider>
        <draggable
          :list="activeData.columns[activeData.selectedCol - 1].type.options"
          :animation="340"
          group="selectItem"
          handle=".option-drag"
          :disabled="disabled || activeData.columns[activeData.selectedCol - 1].type.source"
        >
          <div v-for="(item, index) in activeData.columns[activeData.selectedCol - 1].type.__slot__.options" :key="index" class="select-item">
            <div class="select-line-icon option-drag">
              <a-icon type="unordered-list" style="font-size: 16px" />
            </div>
            <a-input
              v-model="item.label"
              placeholder="选项名"
              :disabled="disabled || activeData.columns[activeData.selectedCol - 1].type.source"
              @change="e => changeLabel(e, index)"
            />
            <div class="close-btn select-line-icon" v-if="!activeData.columns[activeData.selectedCol - 1].type.source && !disabled">
              <a-icon type="minus-circle" style="font-size: 16px" @click="delOption(index)" />
            </div>
          </div>
        </draggable>
        <div style="margin-top: 8px">
          <a-button :disabled="disabled" style="padding-bottom: 0" icon="plus-circle" type="link" @click="addOption"> 添加选项 </a-button>
          <a-button :disabled="disabled" style="padding-bottom: 0; font-size: 11px" type="link" @click="$refs.optionModal.show()"> 设置选项来源 </a-button>
          <a-popconfirm title="确认要清除选项来源吗？" @confirm="clearOption" placement="left" v-if="!disabled">
            <a-button :disabled="disabled" style="padding-bottom: 0; font-size: 11px; color: red" type="link"> 清空选项来源 </a-button>
          </a-popconfirm>
        </div>
      </template>
    </template>
    <option-modal ref="optionModal" @setOption="setOption" />
  </div>
</template>

<script>
// 表格组件的属性配置设置
import draggable from 'vuedraggable'
import { input, textarea, number, link, mail, phone, select, date, address } from '../config/config_common'
import OptionModal from './option-modal.vue'
export default {
  name: 'RightPanelTable',
  props: ['activeData', 'disabled'],
  components: {
    draggable,
    OptionModal
  },
  data() {
    return {
      cols: this.activeData.columns.length
    }
  },
  methods: {
    clearOption() {
      this.$set(this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__, 'options', [
        {
          label: '选项一',
          value: 1
        },
        {
          label: '选项二',
          value: 2
        }
      ])
      this.activeData.columns[this.activeData.selectedCol - 1].type.source = false
    },
    setOption(options) {
      this.$set(
        this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__,
        'options',
        options.map(opt => {
          let { name, id } = opt
          return { label: name, value: id }
        })
      )
      this.activeData.columns[this.activeData.selectedCol - 1].type.source = true
    },

    changeMultiple(val) {
      this.activeData.columns[this.activeData.selectedCol - 1].type.mode = val ? 'multiple' : 'default'
    },

    addCol() {
      this.activeData.selectedCol = -1
      let key = this.activeData.columns[this.activeData.columns.length - 1].key + 1
      let label = '列' + key
      let props = 'col' + key
      this.activeData.columns.push({
        key,
        label,
        props,
        type: {
          __config__: {
            label: '单行文本',
            changeTag: true,
            showLabel: true,
            tag: 'a-input',
            tagIcon: 'icon-dc_input',
            defaultValue: undefined,
            required: true,
            layout: 'colFormItem',
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
            span: 24
          },
          placeholder: '请输入',
          style: { width: '100%' },
          comment: '',
          allowChar: false
        }
      })
    },

    delCol(key) {
      if (this.disabled) {
        return
      }
      this.activeData.selectedCol = -1
      this.activeData.columns = this.activeData.columns.filter(column => column.key != key)
    },

    dragEnd(obj) {
      if (obj.oldIndex + 1 == this.activeData.selectedCol) {
        this.activeData.selectedCol = obj.newIndex + 1
      }
    },

    tagChange(val) {
      if (val == 'a-input') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(input))
      } else if (val == 'a-textarea') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(textarea))
      } else if (val == 'a-input-number') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(number))
      } else if (val == 'formLink') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(link))
      } else if (val == 'formMail') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(mail))
      } else if (val == 'formPhone') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(phone))
      } else if (val == 'formAddress') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(address))
      } else if (val == 'a-select') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(select))
      } else if (val == 'dc-date') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(date))
      }
    },

    delOption(index) {
      if (this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options.length == 1) {
        this.$message.warning('至少需要保留一条选项！')
        return
      }
      this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options.splice(index, 1)
    },

    addOption() {
      for (let i = 0; i < this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options.length; i++) {
        this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options[i].value =
          this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options[i].label
      }
      this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options.push({
        label: '选项',
        value: '选项'
      })
    },
    
    changeLabel(e, index) {
      let label = e.target.value
      this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options[index].value = label
    },

    changeTimeFormat(val, column) {
      if (val === 'yyyy-MM') {
        this.$set(column, 'mode', 'month')
      } else if (val === 'yyyyMM') {
        this.$set(column, 'mode', 'month')
      } else {
        this.$set(column, 'mode', 'year')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.select-item {
  display: flex;
  border: 1px dashed #fff;
  box-sizing: border-box;
  & .close-btn {
    cursor: pointer;
    color: #f56c6c;
  }
  & .el-input + .el-input {
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
  padding: 0 8px;
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
.reg-item {
  padding: 12px 6px;
  background: #f8f8f8;
  position: relative;
  border-radius: 4px;
  .close-btn {
    position: absolute;
    right: -6px;
    top: -6px;
    display: block;
    width: 16px;
    height: 16px;
    line-height: 16px;
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
