<template>
  <div class="right-board">
    <el-tabs v-model="currentTab" class="center-tabs">
      <el-tab-pane label="组件属性" name="field" />
      <el-tab-pane label="表单属性" name="form" />
    </el-tabs>

    <div class="field-box">
      <!-- 组件属性 -->
      <el-form
        v-show="currentTab === 'field' && showField"
        size="small"
        label-width="90px"
      >
        <el-form-item v-if="activeData.__config__.changeTag" label="组件类型">
          <el-select
            v-model="activeData.__config__.tagIcon"
            placeholder="请选择组件类型"
            :style="{ width: '100%' }"
            @change="tagChange"
          >
            <el-option-group
              v-for="group in tagList"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="item in group.options"
                :key="item.__config__.label"
                :label="item.__config__.label"
                :value="item.__config__.tagIcon"
              >
                <svg-icon
                  class="node-icon"
                  :icon-class="item.__config__.tagIcon"
                />
                <span> {{ item.__config__.label }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.componentName !== undefined"
          label="组件名"
        >
          {{ activeData.__config__.componentName }}
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.label !== undefined"
          label="标题"
        >
          <el-input
            v-model="activeData.__config__.label"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.placeholder !== undefined"
          label="占位提示"
        >
          <el-input
            v-model="activeData.placeholder"
            placeholder="请输入占位提示"
          />
        </el-form-item>

        <el-form-item label="注释" v-if="activeData.comment !== undefined">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入组件注释"
            size="small"
            v-model="activeData.comment"
          />
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.span !== undefined"
          label="组件宽度"
        >
          <el-slider
            v-model="activeData.__config__.span"
            :min="1"
            :max="24"
            :marks="{ 12: '' }"
            @change="spanChange"
          ></el-slider>
        </el-form-item>
        <el-form-item
          v-if="activeData.style && activeData.style.width !== undefined"
          label="输入框宽度"
        >
          <el-slider v-model="inputWidth" :marks="{ 50: '' }"></el-slider>
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.tag === 'customNumber'"
          label="小数位数"
        >
          <el-input-number
            v-model="activeData.precision"
            :min="0"
            placeholder="小数位数"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'customNumber'"
          label="最小值"
        >
          <el-input-number v-model="activeData.min" placeholder="最小值" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'customNumber'"
          label="最大值"
        >
          <el-input-number v-model="activeData.max" placeholder="最大值" />
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.tag === 'el-checkbox-group'"
          label="至少应选"
        >
          <el-input-number
            :value="activeData.min"
            :min="0"
            placeholder="至少应选"
            @input="$set(activeData, 'min', $event ? $event : undefined)"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-checkbox-group'"
          label="最多可选"
        >
          <el-input-number
            :value="activeData.max"
            :min="0"
            placeholder="最多可选"
            @input="$set(activeData, 'max', $event ? $event : undefined)"
          />
        </el-form-item>

        <el-form-item v-if="activeData.format !== undefined" label="时间格式">
          <el-select
            v-model="activeData.format"
            @change="changeTimeFormat"
            style="width: 100%"
          >
            <el-option label="年（yyyy）" value="yyyy" />
            <el-option label="年-月（yyyy-MM）" value="yyyy-MM" />
            <el-option label="年月（yyyyMM）" value="yyyyMM" />
          </el-select>
        </el-form-item>
        <template
          v-if="
            ['el-checkbox-group', 'el-radio-group', 'el-select'].indexOf(
              activeData.__config__.tag
            ) > -1
          "
        >
          <el-divider>选项</el-divider>
          <draggable
            :list="activeData.__slot__.options"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
          >
            <div
              v-for="(item, index) in activeData.__slot__.options"
              :key="index"
              class="select-item"
            >
              <div class="select-line-icon option-drag">
                <i class="el-icon-s-operation" />
              </div>
              <el-input
                v-model="item.label"
                placeholder="选项名"
                size="small"
              />
              <div
                class="close-btn select-line-icon"
                @click="delSelectItem(index)"
              >
                <i class="el-icon-remove-outline" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px">
            <el-button
              style="padding-bottom: 0"
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addSelectItem"
            >
              添加选项
            </el-button>
            <a style="margin-left: 96px">设置选项来源</a>
          </div>
          <el-divider />
        </template>

        <el-form-item
          v-if="activeData.__config__.tag === 'customPhone'"
          label="支持固话"
        >
          <el-switch v-model="activeData.isMobile" />
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.tag === 'el-input'"
          label="禁止汉字"
        >
          <el-switch v-model="activeData.allowChar" />
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.showLabel !== undefined"
          label="显示标签"
        >
          <el-switch v-model="activeData.__config__.showLabel" />
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.tag === 'el-select'"
          label="能否搜索"
        >
          <el-switch v-model="activeData.filterable" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-select'"
          label="是否多选"
        >
          <el-switch v-model="activeData.multiple" @change="multipleChange" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.required !== undefined"
          label="是否必填"
        >
          <el-switch v-model="activeData.__config__.required" />
        </el-form-item>

        <!-- 自定义组件start -->
        <template v-if="activeData.__config__.tag === 'customDivider'">
          <el-divider>分割线设置</el-divider>
          <el-form-item label="标题">
            <el-input v-model="activeData.title" />
          </el-form-item>
          <el-form-item label="字体大小">
            <el-slider
              v-model="activeData.fontSize"
              :min="12"
              :step="1"
              :max="30"
              :marks="{ 16: '', 24: '' }"
            ></el-slider>
          </el-form-item>
        </template>

        <template v-if="activeData.__config__.tag === 'customEditTable'">
          <el-divider>列名 - 属性</el-divider>
          <draggable
            :list="activeData.columns"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
            @end="dragEnd"
          >
            <div
              v-for="(item, index) in activeData.columns"
              :key="index"
              class="select-item"
            >
              <div class="select-line-icon option-drag">
                <i class="el-icon-s-operation" />
              </div>
              <el-input size="small" v-model="item.label" />
              <div class="close-btn select-line-icon">
                <i class="el-icon-remove-outline" @click="delCol(index)" />
              </div>
            </div>
          </draggable>
          <div style="margin-left: 20px">
            <el-button
              style="padding-bottom: 0"
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addCol"
            >
              添加列
            </el-button>
          </div>

          <template v-if="activeData.selectedCol !== -1">
            <el-divider>已选中 : 第{{ activeData.selectedCol }}列</el-divider>
            <el-form-item label="类型">
              <el-select
                v-model="activeData.columns[activeData.selectedCol - 1].type"
                style="width: 100%"
              >
                <el-option label="单行文本" value="input" />
                <el-option label="多行文本" value="inputarea" />
                <el-option label="数字" value="inputnumber" />
                <el-option label="邮箱" value="mail" />
                <el-option label="电话" value="phone" />
                <el-option label="地址" value="address" />
                <el-option label="下拉选择" value="select" />
                <el-option label="日期选择" value="datepick" />
              </el-select>
            </el-form-item>

            <el-form-item label="注释">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入组件注释"
                size="small"
                v-model="activeData.columns[activeData.selectedCol - 1].comment"
              />
            </el-form-item>

            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type === 'phone'
              "
              label="支持固话"
            >
              <el-switch
                v-model="
                  activeData.columns[activeData.selectedCol - 1].isMobile
                "
              />
            </el-form-item>
            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type ===
                  'input' ||
                activeData.columns[activeData.selectedCol - 1].type ===
                  'inputarea'
              "
              label="禁止汉字"
            >
              <el-switch
                v-model="
                  activeData.columns[activeData.selectedCol - 1].allowChar
                "
              />
            </el-form-item>
            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type ===
                'inputnumber'
              "
              label="小数位数"
            >
              <el-input-number
                v-model="
                  activeData.columns[activeData.selectedCol - 1].precision
                "
                :min="0"
                placeholder="小数位数"
              />
            </el-form-item>
            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type ===
                'inputnumber'
              "
              label="最小值"
            >
              <el-input-number
                v-model="activeData.columns[activeData.selectedCol - 1].min"
                placeholder="最小值"
              />
            </el-form-item>
            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type ===
                'inputnumber'
              "
              label="最大值"
            >
              <el-input-number
                v-model="activeData.columns[activeData.selectedCol - 1].max"
                placeholder="最大值"
              />
            </el-form-item>

            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type ===
                'datepick'
              "
              label="时间格式"
            >
              <el-select
                style="width: 100%"
                v-model="activeData.columns[activeData.selectedCol - 1].format"
                @change="changeColTimeFormat"
              >
                <el-option label="年（yyyy）" value="yyyy" />
                <el-option label="年-月（yyyy-MM）" value="yyyy-MM" />
                <el-option label="年月（yyyyMM）" value="yyyyMM" />
              </el-select>
            </el-form-item>

            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type === 'select'
              "
              label="能否搜索"
            >
              <el-switch
                v-model="
                  activeData.columns[activeData.selectedCol - 1].filterable
                "
              />
            </el-form-item>

            <el-form-item
              v-if="
                activeData.columns[activeData.selectedCol - 1].type === 'select'
              "
              label="能否多选"
            >
              <el-switch
                v-model="
                  activeData.columns[activeData.selectedCol - 1].multiple
                "
              />
            </el-form-item>

            <el-form-item label="是否必填">
              <el-switch
                v-model="
                  activeData.columns[activeData.selectedCol - 1].required
                "
              />
            </el-form-item>
            <template
              v-if="
                activeData.columns[activeData.selectedCol - 1].type === 'select'
              "
            >
              <el-divider>选项</el-divider>
              <draggable
                :list="activeData.columns[activeData.selectedCol - 1].options"
                :animation="340"
                group="selectItem"
                handle=".option-drag"
              >
                <div
                  v-for="(item, index) in activeData.columns[
                    activeData.selectedCol - 1
                  ].options"
                  :key="index"
                  class="select-item"
                >
                  <div class="select-line-icon option-drag">
                    <i class="el-icon-s-operation" />
                  </div>
                  <el-input
                    v-model="item.label"
                    placeholder="选项名"
                    size="small"
                  />
                  <div class="close-btn select-line-icon">
                    <i
                      class="el-icon-remove-outline"
                      @click="delTableOption(index)"
                    />
                  </div>
                </div>
              </draggable>
              <div style="margin-left: 20px">
                <el-button
                  style="padding-bottom: 0"
                  icon="el-icon-circle-plus-outline"
                  type="text"
                  @click="addTableOption"
                >
                  添加选项
                </el-button>
                <a style="margin-left: 96px">设置选项来源</a>
              </div>
            </template>
          </template>
        </template>

        <!-- 自定义组件end -->
      </el-form>

      <!-- 表单属性 -->
      <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
        <el-form-item label="表单名">
          <el-input
            v-model="baseInfo.name"
            placeholder="请输入表单名（ref）"
          />
        </el-form-item>
        <!-- <el-form-item label="表单模型">
          <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
        </el-form-item> -->
        <el-form-item label="表单类型">
          <el-input v-model="baseInfo.type" disabled />
        </el-form-item>
        <el-form-item label="表单尺寸">
          <el-radio-group v-model="formConf.size">
            <el-radio-button label="medium"> 中等 </el-radio-button>
            <el-radio-button label="small"> 较小 </el-radio-button>
            <el-radio-button label="mini"> 迷你 </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签对齐">
          <el-radio-group v-model="formConf.labelPosition">
            <el-radio-button label="left"> 左对齐 </el-radio-button>
            <el-radio-button label="right"> 右对齐 </el-radio-button>
            <el-radio-button label="top"> 顶部对齐 </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签宽度">
          <el-slider
            v-model="formConf.labelWidth"
            :min="10"
            :step="10"
            :max="240"
            :marks="{ 120: '' }"
            @change="labelChange"
          ></el-slider>
        </el-form-item>
        <el-form-item label="禁用表单">
          <el-switch v-model="formConf.disabled" />
        </el-form-item>
        <el-divider>表单显隐规则</el-divider>
        <div
          v-for="(item, index) in formConf.componentsVisible"
          :key="index"
          class="reg-item"
        >
          <span class="close-btn">
            <i class="el-icon-close" @click="delRule(index)" />
          </span>
          <a @click="editRule(index)">表单显隐藏规则-第{{ index + 1 }}条</a>
        </div>
        <div style="margin-left: 20px">
          <el-button
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addRule"
          >
            添加规则
          </el-button>
        </div>
      </el-form>
    </div>
    <logic-dialog ref="logicdialog" :form-conf="formConf" />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { saveFormConf } from "../utils/db";
import LogicDialog from "./logic-dialog";
import { inputComponents, selectComponents } from "../generator/config";
export default {
  name: "RightPanel",
  components: {
    draggable,
    LogicDialog,
  },
  props: ["showField", "activeData", "formConf", "baseInfo"],
  data() {
    return {
      currentTab: "field",
    };
  },
  computed: {
    inputWidth: {
      get() {
        if (this.activeData.style != undefined) {
          return parseInt(this.activeData.style.width);
        }
        return 0;
      },
      set(val) {
        this.$set(this.activeData, "style", { width: val + "%" });
      },
    },
    tagList() {
      return [
        {
          label: "输入型组件",
          options: inputComponents,
        },
        {
          label: "选择型组件",
          options: selectComponents,
        },
      ];
    },
  },
  watch: {
    formConf: {
      handler(val) {
        saveFormConf(val);
      },
      deep: true,
    },
  },
  methods: {
    // ==============自定义Start==============
    addCol() {
      for (let i = 0; i < this.activeData.columns.length; i++) {
        this.activeData.columns[i].index = i + 1;
        this.activeData.columns[i].props = "col" + (i + 1);
      }
      this.activeData.columns.push({
        index: this.activeData.col + 1,
        label: "列" + (this.activeData.col + 1),
        props: "col" + (this.activeData.col + 1),
        type: "input",
        required: true,
        options: [
          {
            label: "选项一",
            value: 1,
          },
          {
            label: "选项二",
            value: 2,
          },
        ],
        allowChar: false,
        precision: 0,
        min: undefined,
        max: undefined,
        isMobile: false,
        format: "yyyy-MM",
        "value-format": "yyyy-MM",
        dateType: "month",
        comment: "",
        filterable: false,
        multiple: false,
      });
      this.activeData.col++;
    },

    delCol(index) {
      this.activeData.selectedCol = -1;
      this.activeData.columns.splice(index, 1);
      this.activeData.col--;
      for (let i = 0; i < this.activeData.columns.length; i++) {
        this.activeData.columns[i].index = i + 1;
        this.activeData.columns[i].props = "col" + (i + 1);
      }
    },
    addTableOption() {
      for (
        let i = 0;
        i <
        this.activeData.columns[this.activeData.selectedCol - 1].options.length;
        i++
      ) {
        this.activeData.columns[this.activeData.selectedCol - 1].options[
          i
        ].value = i + 1;
      }
      this.activeData.columns[this.activeData.selectedCol - 1].options.push({
        label: "选项",
        value:
          this.activeData.columns[this.activeData.selectedCol - 1].options
            .length + 1,
      });
    },
    delTableOption(index) {
      this.activeData.columns[this.activeData.selectedCol - 1].options.splice(
        index,
        1
      );
      for (
        let i = 0;
        i <
        this.activeData.columns[this.activeData.selectedCol - 1].options.length;
        i++
      ) {
        this.activeData.columns[this.activeData.selectedCol - 1].options[
          i
        ].value = i + 1;
      }
    },

    addRule() {
      this.$refs.logicdialog.show();
    },

    delRule(index) {
      this.formConf.componentsVisible.splice(index, 1);
    },

    editRule(index) {
      this.$refs.logicdialog.show(index);
    },

    changeTimeFormat(val) {
      if (val === "yyyy-MM") {
        this.$set(this.activeData, "value-format", "yyyy-MM");
        this.$set(this.activeData, "type", "month");
      } else if (val === "yyyyMM") {
        this.$set(this.activeData, "value-format", "yyyyMM");
        this.$set(this.activeData, "type", "month");
      } else {
        this.$set(this.activeData, "type", "yyyy");
        this.$set(this.activeData, "type", "year");
      }
    },

    changeColTimeFormat(val) {
      let selectedCol = this.activeData.selectedCol;
      if (val === "yyyy-MM") {
        this.$set(
          this.activeData.columns[selectedCol - 1],
          "value-format",
          "yyyy-MM"
        );
        this.$set(
          this.activeData.columns[selectedCol - 1],
          "dateType",
          "month"
        );
      } else if (val === "yyyyMM") {
        this.$set(
          this.activeData.columns[selectedCol - 1],
          "value-format",
          "yyyyMM"
        );
        this.$set(
          this.activeData.columns[selectedCol - 1],
          "dateType",
          "month"
        );
      } else {
        this.$set(
          this.activeData.columns[selectedCol - 1],
          "value-format",
          "yyyy"
        );
        this.$set(this.activeData.columns[selectedCol - 1], "dateType", "year");
      }
    },

    // ==============自定义END==============

    addSelectItem() {
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = i + 1;
      }
      this.activeData.__slot__.options.push({
        label: "选项",
        value: this.activeData.__slot__.options.length + 1,
      });
    },
    delSelectItem(index) {
      this.activeData.__slot__.options.splice(index, 1);
      for (let i = 0; i < this.activeData.__slot__.options.length; i++) {
        this.activeData.__slot__.options[i].value = i + 1;
      }
    },
    spanChange(val) {
      this.$set(this.formConf, "span", val);
    },
    labelChange(val) {
      this.$set(this.formConf, "labelWidth", val);
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, "defaultValue", val ? [] : "");
    },
    dragEnd(obj) {
      if (obj.oldIndex + 1 == this.activeData.selectedCol) {
        this.activeData.selectedCol = obj.newIndex + 1;
      }
    },

    tagChange(tagIcon) {
      let target = inputComponents.find(
        (item) => item.__config__.tagIcon === tagIcon
      );
      if (!target)
        target = selectComponents.find(
          (item) => item.__config__.tagIcon === tagIcon
        );
      this.$emit("tag-change", target);
    },
  },
};
</script>

<style lang="scss" scoped>
.right-board {
  width: 350px;
  position: absolute;
  right: 0;
  top: 0;
  .field-box {
    position: relative;
    box-sizing: border-box;
    height: calc(100vh - 42px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0 12px 0 0;
  }
}
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
.time-range {
  .el-date-editor {
    width: 227px;
  }
  ::v-deep .el-icon-time {
    display: none;
  }
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
