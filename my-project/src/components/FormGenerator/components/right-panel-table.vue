<template>
  <div>
    <div>
      <template>
        <a-divider>列名 - 属性</a-divider>
        <draggable :list="activeData.columns" :animation="340" group="selectItem" handle=".option-drag" @end="dragEnd">
          <div v-for="item in activeData.columns" :key="item.key" class="select-item">
            <div class="select-line-icon option-drag">
              <a-icon type="unordered-list" style="font-size: 18px" />
            </div>
            <a-input v-model="item.label" />
            <div class="close-btn select-line-icon">
              <a-icon type="delete" style="font-size: 18px" @click="delCol(item.key)" />
            </div>
          </div>
        </draggable>
        <div style="margin-top: 8px">
          <a-button style="padding-bottom: 0" icon="plus-circle" type="link" @click="addCol"> 添加列 </a-button>
        </div>
      </template>
    </div>
    <template v-if="activeData.selectedCol !== -1">
      <a-divider>已选中 : 第{{ activeData.selectedCol }}列</a-divider>
      <a-form-model-item label="类型" :labelCol="{ span: 6, offset: 0 }" :wrapperCol="{ span: 18, offset: 0 }">
        <a-select v-model="activeData.columns[activeData.selectedCol - 1].type.__config__.label" @change="tagChange">
          <a-select-option value="单行文本">单行文本</a-select-option>
          <a-select-option value="多行文本">多行文本</a-select-option>
          <a-select-option value="数字">数字</a-select-option>
          <a-select-option value="邮箱">邮箱</a-select-option>
          <a-select-option value="电话">电话</a-select-option>
          <a-select-option value="链接">链接</a-select-option>
          <a-select-option value="地址">地址</a-select-option>
          <a-select-option value="下拉选择">下拉选择</a-select-option>
          <a-select-option value="日期选择">日期选择</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '电话'"
        label="支持固话"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.isMobile" />
      </a-form-model-item>
      <a-form-model-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__.label === '单行文本' || activeData.columns[activeData.selectedCol - 1].type.__config__.label === '多行文本'
        "
        label="禁止汉字"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.allowChar" />
      </a-form-model-item>
      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '数字'"
        label="小数位数"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-input-number v-model="activeData.columns[activeData.selectedCol - 1].type.precision" :min="0" placeholder="小数位数" />
      </a-form-model-item>
      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '数字'"
        label="最小值"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-input-number v-model="activeData.columns[activeData.selectedCol - 1].type.min" placeholder="最小值" />
      </a-form-model-item>
      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '数字'"
        label="最大值"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-input-number v-model="activeData.columns[activeData.selectedCol - 1].type.max" placeholder="最大值" />
      </a-form-model-item>

      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '地址'"
        label="地址格式"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-select v-model="activeData.columns[activeData.selectedCol - 1].type.type">
          <a-select-option value="国/省（直辖市、自治区）/市">国/省（直辖市、自治区）/市</a-select-option>
          <a-select-option value="省（直辖市、自治区）/市/区-详细地址" title="省（直辖市、自治区）/市/区-详细地址">省（直辖市、自治区）/市/区-详细地址</a-select-option>
          <a-select-option value="省（直辖市、自治区）/市/区">省（直辖市、自治区）/市/区</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '日期选择'"
        label="时间格式"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-select v-model="activeData.columns[activeData.selectedCol - 1].type.format" @change="val => changeTimeFormat(val, activeData.columns[activeData.selectedCol - 1].type)">
          <a-select-option value="YYYY">年（yyyy）</a-select-option>
          <a-select-option value="YYYY-MM">年-月（yyyy-MM）</a-select-option>
          <a-select-option value="YYYYMM">年月（yyyyMM）</a-select-option>
        </a-select>
      </a-form-model-item>

      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '下拉选择'"
        label="能否搜索"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.showSearch" />
      </a-form-model-item>

      <a-form-model-item
        v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '下拉选择'"
        label="能否多选"
        :labelCol="{ span: 6, offset: 0 }"
        :wrapperCol="{ span: 18, offset: 0 }"
      >
        <a-switch :value="activeData.columns[activeData.selectedCol - 1].type.mode === 'default'" @change="changeMultiple" />
      </a-form-model-item>

      <a-form-model-item label="是否必填" :labelCol="{ span: 6, offset: 0 }" :wrapperCol="{ span: 18, offset: 0 }">
        <a-switch v-model="activeData.columns[activeData.selectedCol - 1].type.__config__.required" />
      </a-form-model-item>

      <a-form-model-item label="注释" :labelCol="{ span: 6, offset: 0 }" :wrapperCol="{ span: 18, offset: 0 }">
        <a-textarea
          :rows="4"
          :placeholder="`请输入${activeData.columns[activeData.selectedCol - 1].label}注释`"
          v-model="activeData.columns[activeData.selectedCol - 1].type.comment"
        />
      </a-form-model-item>

      <template v-if="activeData.columns[activeData.selectedCol - 1].type.__config__.label === '下拉选择'">
        <a-divider>选项</a-divider>
        <draggable :list="activeData.columns[activeData.selectedCol - 1].type.options" :animation="340" group="selectItem" handle=".option-drag">
          <div v-for="(item, index) in activeData.columns[activeData.selectedCol - 1].type.__slot__.options" :key="index" class="select-item">
            <div class="select-line-icon option-drag">
              <a-icon type="unordered-list" style="font-size: 18px" />
            </div>
            <a-input v-model="item.label" placeholder="选项名" />
            <div class="close-btn select-line-icon">
              <a-icon type="delete" style="font-size: 18px" @click="delOption(index)" />
            </div>
          </div>
        </draggable>
        <div style="margin-top: 8px">
          <a-button style="padding-bottom: 0" icon="plus-circle" type="link" @click="addOption"> 添加选项 </a-button>
          <a style="margin-left: 96px">设置选项来源</a>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
// 表格组件的属性配置设置
import draggable from 'vuedraggable'
import { input, textarea, number, link, mail, phone, select, date, address } from '../config/config_common'
export default {
  name: 'RightPanelTable',
  props: ['activeData'],
  components: {
    draggable
  },
  data() {
    return {
      cols: this.activeData.columns.length
    }
  },
  methods: {
    
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
        type: input
      })
    },

    delCol(key) {
      this.activeData.selectedCol = -1
      this.activeData.columns = this.activeData.columns.filter(column => column.key != key)
    },

    dragEnd(obj) {
      if (obj.oldIndex + 1 == this.activeData.selectedCol) {
        this.activeData.selectedCol = obj.newIndex + 1
      }
    },

    tagChange(val) {
      if (val == '单行文本') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(input))
      } else if (val == '多行文本') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(textarea))
      } else if (val == '数字') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(number))
      } else if (val == '链接') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(link))
      } else if (val == '邮箱') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(mail))
      } else if (val == '电话') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(phone))
      } else if (val == '地址') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(address))
      } else if (val == '下拉选择') {
        this.activeData.columns[this.activeData.selectedCol - 1].type = JSON.parse(JSON.stringify(select))
      } else if (val == '日期选择') {
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
      this.activeData.columns[this.activeData.selectedCol - 1].type.__slot__.options.push({
        label: '选项',
        value: ''
      })
    },

    changeTimeFormat(val, column) {
      if (val === 'YYYY-MM') {
        this.$set(column, 'mode', 'month')
      } else if (val === 'YYYYMM') {
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
</style>
