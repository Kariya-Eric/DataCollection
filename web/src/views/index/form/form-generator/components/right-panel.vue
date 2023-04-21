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
        <el-form-item v-if="activeData.__vModel__ !== undefined" label="字段名">
          <el-input
            v-model="activeData.__vModel__"
            placeholder="请输入字段名（v-model）"
          />
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
        <el-form-item
          v-if="activeData['start-placeholder'] !== undefined"
          label="开始占位"
        >
          <el-input
            v-model="activeData['start-placeholder']"
            placeholder="请输入占位提示"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData['end-placeholder'] !== undefined"
          label="结束占位"
        >
          <el-input
            v-model="activeData['end-placeholder']"
            placeholder="请输入占位提示"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.style && activeData.style.width !== undefined"
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
        <el-form-item v-if="activeData.__vModel__ !== undefined" label="默认值">
          <el-input
            :value="setDefaultValue(activeData.__config__.defaultValue)"
            placeholder="请输入默认值"
            @input="onDefaultValueInput"
          />
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
        <el-form-item
          v-if="
            activeData.__slot__ && activeData.__slot__.prepend !== undefined
          "
          label="前缀"
        >
          <el-input
            v-model="activeData.__slot__.prepend"
            placeholder="请输入前缀"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.__slot__ && activeData.__slot__.append !== undefined"
          label="后缀"
        >
          <el-input
            v-model="activeData.__slot__.append"
            placeholder="请输入后缀"
          />
        </el-form-item>
        <el-form-item v-if="activeData.autosize !== undefined" label="最小行数">
          <el-input-number
            v-model="activeData.autosize.minRows"
            :min="1"
            placeholder="最小行数"
          />
        </el-form-item>
        <el-form-item v-if="activeData.autosize !== undefined" label="最大行数">
          <el-input-number
            v-model="activeData.autosize.maxRows"
            :min="1"
            placeholder="最大行数"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-input-number'"
          label="最小值"
        >
          <el-input-number v-model="activeData.min" placeholder="最小值" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-input-number'"
          label="最大值"
        >
          <el-input-number v-model="activeData.max" placeholder="最大值" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-input-number'"
          label="步长"
        >
          <el-input-number v-model="activeData.step" placeholder="步长" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-input-number'"
          label="精度"
        >
          <el-input-number
            v-model="activeData.precision"
            :min="0"
            placeholder="精度"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-input-number'"
          label="按钮位置"
        >
          <el-radio-group v-model="activeData['controls-position']">
            <el-radio-button label=""> 默认 </el-radio-button>
            <el-radio-button label="right"> 右侧 </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="activeData.maxlength !== undefined"
          label="最多输入"
        >
          <el-input v-model="activeData.maxlength" placeholder="请输入字符长度">
            <template slot="append"> 个字符 </template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="activeData['active-text'] !== undefined"
          label="开启提示"
        >
          <el-input
            v-model="activeData['active-text']"
            placeholder="请输入开启提示"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData['inactive-text'] !== undefined"
          label="关闭提示"
        >
          <el-input
            v-model="activeData['inactive-text']"
            placeholder="请输入关闭提示"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData['active-value'] !== undefined"
          label="开启值"
        >
          <el-input
            :value="setDefaultValue(activeData['active-value'])"
            placeholder="请输入开启值"
            @input="onSwitchValueInput($event, 'active-value')"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData['inactive-value'] !== undefined"
          label="关闭值"
        >
          <el-input
            :value="setDefaultValue(activeData['inactive-value'])"
            placeholder="请输入关闭值"
            @input="onSwitchValueInput($event, 'inactive-value')"
          />
        </el-form-item>
        <el-form-item
          v-if="
            activeData.type !== undefined &&
            'el-date-picker' === activeData.__config__.tag
          "
          label="时间类型"
        >
          <el-select
            v-model="activeData.type"
            placeholder="请选择时间类型"
            :style="{ width: '100%' }"
            @change="dateTypeChange"
          >
            <el-option
              v-for="(item, index) in dateOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="activeData['range-separator'] !== undefined"
          label="分隔符"
        >
          <el-input
            v-model="activeData['range-separator']"
            placeholder="请输入分隔符"
          />
        </el-form-item>
        <el-form-item
          v-if="activeData['picker-options'] !== undefined"
          label="时间段"
        >
          <el-input
            v-model="activeData['picker-options'].selectableRange"
            placeholder="请输入时间段"
          />
        </el-form-item>
        <el-form-item v-if="activeData.format !== undefined" label="时间格式">
          <el-input
            :value="activeData.format"
            placeholder="请输入时间格式"
            @input="setTimeValue($event)"
          />
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
              <el-input
                placeholder="选项值"
                size="small"
                :value="item.value"
                @input="setOptionValue(item, $event)"
              />
              <div
                class="close-btn select-line-icon"
                @click="activeData.__slot__.options.splice(index, 1)"
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
          </div>
          <el-divider />
        </template>

        <template
          v-if="['el-cascader', 'el-table'].includes(activeData.__config__.tag)"
        >
          <el-divider>选项</el-divider>
          <el-form-item v-if="activeData.__config__.dataType" label="数据类型">
            <el-radio-group
              v-model="activeData.__config__.dataType"
              size="small"
            >
              <el-radio-button label="dynamic"> 动态数据 </el-radio-button>
              <el-radio-button label="static"> 静态数据 </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <template v-if="activeData.__config__.dataType === 'dynamic'">
            <el-form-item label="接口地址">
              <el-input
                v-model="activeData.__config__.url"
                :title="activeData.__config__.url"
                placeholder="请输入接口地址"
                clearable
                @blur="$emit('fetch-data', activeData)"
              >
                <el-select
                  slot="prepend"
                  v-model="activeData.__config__.method"
                  :style="{ width: '85px' }"
                  @change="$emit('fetch-data', activeData)"
                >
                  <el-option label="get" value="get" />
                  <el-option label="post" value="post" />
                  <el-option label="put" value="put" />
                  <el-option label="delete" value="delete" />
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="数据位置">
              <el-input
                v-model="activeData.__config__.dataPath"
                placeholder="请输入数据位置"
                @blur="$emit('fetch-data', activeData)"
              />
            </el-form-item>

            <template v-if="activeData.props && activeData.props.props">
              <el-form-item label="标签键名">
                <el-input
                  v-model="activeData.props.props.label"
                  placeholder="请输入标签键名"
                />
              </el-form-item>
              <el-form-item label="值键名">
                <el-input
                  v-model="activeData.props.props.value"
                  placeholder="请输入值键名"
                />
              </el-form-item>
              <el-form-item label="子级键名">
                <el-input
                  v-model="activeData.props.props.children"
                  placeholder="请输入子级键名"
                />
              </el-form-item>
            </template>
          </template>

          <!-- 级联选择静态树 -->
          <el-tree
            v-if="activeData.__config__.dataType === 'static'"
            draggable
            :data="activeData.options"
            node-key="id"
            :expand-on-click-node="false"
            :render-content="renderContent"
          />
          <div
            v-if="activeData.__config__.dataType === 'static'"
            style="margin-left: 20px"
          >
            <el-button
              style="padding-bottom: 0"
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addTreeItem"
            >
              添加父级
            </el-button>
          </div>
          <el-divider />
        </template>

        <el-form-item
          v-if="activeData['active-color'] !== undefined"
          label="开启颜色"
        >
          <el-color-picker v-model="activeData['active-color']" />
        </el-form-item>
        <el-form-item
          v-if="activeData['inactive-color'] !== undefined"
          label="关闭颜色"
        >
          <el-color-picker v-model="activeData['inactive-color']" />
        </el-form-item>

        <el-form-item
          v-if="activeData.__config__.showLabel !== undefined"
          label="显示标签"
        >
          <el-switch v-model="activeData.__config__.showLabel" />
        </el-form-item>

        <el-form-item
          v-if="activeData['show-word-limit'] !== undefined"
          label="输入统计"
        >
          <el-switch v-model="activeData['show-word-limit']" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-input-number'"
          label="严格步数"
        >
          <el-switch v-model="activeData['step-strictly']" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-cascader'"
          label="任选层级"
        >
          <el-switch v-model="activeData.props.props.checkStrictly" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-cascader'"
          label="是否多选"
        >
          <el-switch v-model="activeData.props.props.multiple" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-cascader'"
          label="展示全路径"
        >
          <el-switch v-model="activeData['show-all-levels']" />
        </el-form-item>
        <el-form-item
          v-if="activeData.__config__.tag === 'el-cascader'"
          label="可否筛选"
        >
          <el-switch v-model="activeData.filterable" />
        </el-form-item>
        <el-form-item
          v-if="activeData.clearable !== undefined"
          label="能否清空"
        >
          <el-switch v-model="activeData.clearable" />
        </el-form-item>
        <el-form-item v-if="activeData.readonly !== undefined" label="是否只读">
          <el-switch v-model="activeData.readonly" />
        </el-form-item>
        <el-form-item v-if="activeData.disabled !== undefined" label="是否禁用">
          <el-switch v-model="activeData.disabled" />
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

        <template v-if="activeData.__config__.layoutTree">
          <el-form-item label="组件间隔">
            <el-slider
              v-model="activeData.__config__.gutter"
              :min="0"
              :max="30"
              :marks="{ 15: '' }"
              @change="rowGutterChange"
            />
          </el-form-item>
          <el-divider>布局结构树</el-divider>
          <el-tree
            :data="[activeData.__config__]"
            :props="layoutTreeProps"
            node-key="renderKey"
            default-expand-all
            draggable
          >
            <span slot-scope="{ node, data }">
              <span class="node-label">
                <svg-icon
                  class="node-icon"
                  :icon-class="
                    data.__config__ ? data.__config__.tagIcon : data.tagIcon
                  "
                />
                {{ node.label }}
              </span>
            </span>
          </el-tree>
        </template>

        <template v-if="Array.isArray(activeData.__config__.regList)">
          <el-divider>正则校验</el-divider>
          <div
            v-for="(item, index) in activeData.__config__.regList"
            :key="index"
            class="reg-item"
          >
            <span
              class="close-btn"
              @click="activeData.__config__.regList.splice(index, 1)"
            >
              <i class="el-icon-close" />
            </span>
            <el-form-item label="表达式">
              <el-input v-model="item.pattern" placeholder="请输入正则" />
            </el-form-item>
            <el-form-item label="错误提示" style="margin-bottom: 0">
              <el-input v-model="item.message" placeholder="请输入错误提示" />
            </el-form-item>
          </div>
          <div style="margin-left: 20px">
            <el-button
              icon="el-icon-circle-plus-outline"
              type="text"
              @click="addReg"
            >
              添加规则
            </el-button>
          </div>
        </template>

        <!-- 自定义组件start -->
        <template v-if="activeData.__config__.tag === 'customDivider'">
          <el-divider>分割线设置</el-divider>
          <el-form-item label="标题">
            <el-input v-model="activeData.title" />
          </el-form-item>
          <el-form-item label="标题位置">
            <el-radio-group v-model="activeData.titlePosition">
              <el-radio-button label="left"> 居左 </el-radio-button>
              <el-radio-button label="center"> 居中 </el-radio-button>
              <el-radio-button label="right"> 居右 </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-slider
              v-model="activeData.fontSize"
              :min="1"
              :step="1"
              :max="32"
              :marks="{ 14: '', 24: '' }"
            ></el-slider>
          </el-form-item>
          <el-form-item label="字体间距">
            <el-slider
              v-model="activeData.letterSpacing"
              :min="0"
              :step="0.1"
              :max="1.0"
              :marks="{ 0.2: '' }"
            ></el-slider>
          </el-form-item>
          <el-form-item label="字体颜色">
            <el-color-picker v-model="activeData.color" />
          </el-form-item>
        </template>

        <template v-if="activeData.__config__.tag === 'customEditTable'">
          <el-divider>列名 - 属性</el-divider>
          <draggable
            :list="activeData.columns"
            :animation="340"
            group="selectItem"
            handle=".option-drag"
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
              <el-input size="small" v-model="item.props" />
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
          </template>
        </template>

        <!-- 自定义组件end -->
      </el-form>

      <!-- 表单属性 -->
      <el-form v-show="currentTab === 'form'" size="small" label-width="90px">
        <el-form-item label="表单名">
          <el-input
            v-model="formConf.formRef"
            placeholder="请输入表单名（ref）"
          />
        </el-form-item>
        <el-form-item label="表单模型">
          <el-input v-model="formConf.formModel" placeholder="请输入数据模型" />
        </el-form-item>
        <el-form-item label="校验模型">
          <el-input v-model="formConf.formRules" placeholder="请输入校验模型" />
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
        <el-form-item label="表单按钮">
          <el-switch v-model="formConf.formBtns" />
        </el-form-item>
      </el-form>
    </div>

    <treeNode-dialog
      :visible.sync="dialogVisible"
      title="添加选项"
      @commit="addNode"
    />
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { isArray } from "util";
import TreeNodeDialog from "./treenode-dialog.vue";
import { isNumberStr } from "../utils/index";
import { saveFormConf } from "../utils/db";

const dateTimeFormat = {
  date: "yyyy-MM-dd",
  week: "yyyy 第 WW 周",
  month: "yyyy-MM",
  year: "yyyy",
  datetime: "yyyy-MM-dd HH:mm:ss",
  daterange: "yyyy-MM-dd",
  monthrange: "yyyy-MM",
  datetimerange: "yyyy-MM-dd HH:mm:ss",
};

export default {
  name: "RightPanel",
  components: {
    TreeNodeDialog,
    draggable,
  },
  props: ["showField", "activeData", "formConf"],
  data() {
    return {
      currentTab: "field",
      currentNode: null,
      dialogVisible: false,
      dateTypeOptions: [
        {
          label: "日(date)",
          value: "date",
        },
        {
          label: "周(week)",
          value: "week",
        },
        {
          label: "月(month)",
          value: "month",
        },
        {
          label: "年(year)",
          value: "year",
        },
        {
          label: "日期时间(datetime)",
          value: "datetime",
        },
      ],
      dateRangeTypeOptions: [
        {
          label: "日期范围(daterange)",
          value: "daterange",
        },
        {
          label: "月范围(monthrange)",
          value: "monthrange",
        },
        {
          label: "日期时间范围(datetimerange)",
          value: "datetimerange",
        },
      ],
      layoutTreeProps: {
        label(data, node) {
          const config = data.__config__;
          return data.componentName || `${config.label}: ${data.__vModel__}`;
        },
      },
    };
  },
  computed: {
    dateOptions() {
      if (
        this.activeData.type !== undefined &&
        this.activeData.__config__.tag === "el-date-picker"
      ) {
        if (this.activeData["start-placeholder"] === undefined) {
          return this.dateTypeOptions;
        }
        return this.dateRangeTypeOptions;
      }
      return [];
    },
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
      this.activeData.columns.push({
        index: this.activeData.col + 1,
        label: "列" + (this.activeData.col + 1),
        props: "col" + (this.activeData.col + 1),
      });
      this.activeData.col++;
    },

    delCol(index) {
      this.activeData.columns.splice(index, 1);
      this.activeData.col--;
    },
    // ==============自定义END==============
    addReg() {
      this.activeData.__config__.regList.push({
        pattern: "",
        message: "",
      });
    },
    addSelectItem() {
      this.activeData.__slot__.options.push({
        label: "",
        value: "",
      });
    },
    addTreeItem() {
      ++this.idGlobal;
      this.dialogVisible = true;
      this.currentNode = this.activeData.options;
    },
    renderContent(h, { node, data, store }) {
      return (
        <div class="custom-tree-node">
          <span>{node.label}</span>
          <span class="node-operation">
            <i
              on-click={() => this.append(data)}
              class="el-icon-plus"
              title="添加"
            ></i>
            <i
              on-click={() => this.remove(node, data)}
              class="el-icon-delete"
              title="删除"
            ></i>
          </span>
        </div>
      );
    },
    append(data) {
      if (!data.children) {
        this.$set(data, "children", []);
      }
      this.dialogVisible = true;
      this.currentNode = data.children;
    },
    remove(node, data) {
      this.activeData.__config__.defaultValue = []; // 避免删除时报错
      const { parent } = node;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
    addNode(data) {
      this.currentNode.push(data);
    },
    setOptionValue(item, val) {
      item.value = isNumberStr(val) ? +val : val;
    },
    setDefaultValue(val) {
      if (Array.isArray(val)) {
        return val.join(",");
      }
      // if (['string', 'number'].indexOf(typeof val) > -1) {
      //   return val
      // }
      if (typeof val === "boolean") {
        return `${val}`;
      }
      return val;
    },
    onDefaultValueInput(str) {
      if (isArray(this.activeData.__config__.defaultValue)) {
        // 数组
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          str.split(",").map((val) => (isNumberStr(val) ? +val : val))
        );
      } else if (["true", "false"].indexOf(str) > -1) {
        // 布尔
        this.$set(this.activeData.__config__, "defaultValue", JSON.parse(str));
      } else {
        // 字符串和数字
        this.$set(
          this.activeData.__config__,
          "defaultValue",
          isNumberStr(str) ? +str : str
        );
      }
    },
    onSwitchValueInput(val, name) {
      if (["true", "false"].indexOf(val) > -1) {
        this.$set(this.activeData, name, JSON.parse(val));
      } else {
        this.$set(this.activeData, name, isNumberStr(val) ? +val : val);
      }
    },
    setTimeValue(val, type) {
      const valueFormat = type === "week" ? dateTimeFormat.date : val;
      this.$set(this.activeData.__config__, "defaultValue", null);
      this.$set(this.activeData, "value-format", valueFormat);
      this.$set(this.activeData, "format", val);
    },
    spanChange(val) {
      this.$set(this.formConf, "span", val);
    },
    labelChange(val) {
      this.$set(this.formConf, "labelWidth", val);
    },
    rowGutterChange(val) {
      this.$set(this.activeData.__config__, "gutter", val);
    },
    multipleChange(val) {
      this.$set(this.activeData.__config__, "defaultValue", val ? [] : "");
    },
    dateTypeChange(val) {
      this.setTimeValue(dateTimeFormat[val], val);
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
