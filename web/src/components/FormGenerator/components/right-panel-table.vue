<template>
  <div>
    <div v-if="activeData.__config__.tag == 'fixedTable'">
      <el-divider>列名 - 属性</el-divider>
      <draggable
        :list="activeData.columns"
        :animation="340"
        group="selectItem"
        handle=".option-drag"
        @end="dragEnd"
      >
        <div
          v-for="item in activeData.columns"
          :key="item.key"
          class="select-item"
        >
          <div class="select-line-icon option-drag">
            <i class="el-icon-s-operation" />
          </div>
          <el-input size="small" v-model="item.label" />
          <div class="close-btn select-line-icon">
            <i class="el-icon-remove-outline" @click="delCol(item.key)" />
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
    </div>

    <div v-if="activeData.__config__.tag == 'floatTable'">
      <el-divider>表格设置</el-divider>
      <el-form-item label="列数">
        <el-input-number
          v-model="cols"
          :min="1"
          :precision="0"
          placeholder="请选择列数"
          @change="changeFloatCol"
        />
      </el-form-item>
      <div style="margin-left: 20px">
        <el-button type="text" @click="showHeader"> 设置表头 </el-button>
      </div>
    </div>

    <template v-if="activeData.selectedCol !== -1">
      <el-divider>已选中 : 第{{ activeData.selectedCol }}列</el-divider>
      <el-form-item label="类型">
        <el-select
          v-model="
            activeData.columns[activeData.selectedCol - 1].type.__config__.label
          "
          style="width: 100%"
          @change="tagChange"
        >
          <el-option label="单行文本" value="单行文本" />
          <el-option label="多行文本" value="多行文本" />
          <el-option label="数字" value="数字" />
          <el-option label="邮箱" value="邮箱" />
          <el-option label="电话" value="电话" />
          <el-option label="链接" value="链接" />
          <el-option label="地址" value="地址" />
          <el-option label="下拉选择" value="下拉选择" />
          <el-option label="日期选择" value="日期选择" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '电话'
        "
        label="支持固话"
      >
        <el-switch
          v-model="activeData.columns[activeData.selectedCol - 1].type.isMobile"
        />
      </el-form-item>
      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '单行文本' ||
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '多行文本'
        "
        label="禁止汉字"
      >
        <el-switch
          v-model="
            activeData.columns[activeData.selectedCol - 1].type.allowChar
          "
        />
      </el-form-item>
      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '数字'
        "
        label="小数位数"
      >
        <el-input-number
          v-model="
            activeData.columns[activeData.selectedCol - 1].type.precision
          "
          :min="0"
          placeholder="小数位数"
        />
      </el-form-item>
      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '数字'
        "
        label="最小值"
      >
        <el-input-number
          v-model="activeData.columns[activeData.selectedCol - 1].type.min"
          placeholder="最小值"
        />
      </el-form-item>
      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '数字'
        "
        label="最大值"
      >
        <el-input-number
          v-model="activeData.columns[activeData.selectedCol - 1].type.max"
          placeholder="最大值"
        />
      </el-form-item>

      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '地址'
        "
        label="地址格式"
      >
        <el-select
          v-model="activeData.columns[activeData.selectedCol - 1].type.type"
          style="width: 100%"
        >
          <el-option
            label="国/省（直辖市、自治区）/市"
            value="国/省（直辖市、自治区）/市"
          />
          <el-option
            label="省（直辖市、自治区）/市/区-详细地址"
            value="省（直辖市、自治区）/市/区-详细地址"
          />
          <el-option
            label="省（直辖市、自治区）/市/区"
            value="省（直辖市、自治区）/市/区"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '日期选择'
        "
        label="时间格式"
      >
        <el-select
          style="width: 100%"
          v-model="activeData.columns[activeData.selectedCol - 1].type.format"
          @change="
            (val) =>
              changeTimeFormat(
                val,
                activeData.columns[activeData.selectedCol - 1].type
              )
          "
        >
          <el-option label="年（yyyy）" value="yyyy" />
          <el-option label="年-月（yyyy-MM）" value="yyyy-MM" />
          <el-option label="年月（yyyyMM）" value="yyyyMM" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '下拉选择'
        "
        label="能否搜索"
      >
        <el-switch
          v-model="
            activeData.columns[activeData.selectedCol - 1].type.filterable
          "
        />
      </el-form-item>

      <el-form-item
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '下拉选择'
        "
        label="能否多选"
      >
        <el-switch
          v-model="activeData.columns[activeData.selectedCol - 1].type.multiple"
        />
      </el-form-item>

      <el-form-item label="是否必填">
        <el-switch
          v-model="
            activeData.columns[activeData.selectedCol - 1].type.__config__
              .required
          "
        />
      </el-form-item>

      <el-form-item label="注释">
        <el-input
          type="textarea"
          :rows="4"
          :placeholder="`请输入${
            activeData.columns[activeData.selectedCol - 1].label
          }注释`"
          size="small"
          v-model="activeData.columns[activeData.selectedCol - 1].type.comment"
        />
      </el-form-item>

      <template
        v-if="
          activeData.columns[activeData.selectedCol - 1].type.__config__
            .label === '下拉选择'
        "
      >
        <el-divider>选项</el-divider>
        <draggable
          :list="activeData.columns[activeData.selectedCol - 1].type.options"
          :animation="340"
          group="selectItem"
          handle=".option-drag"
        >
          <div
            v-for="(item, index) in activeData.columns[
              activeData.selectedCol - 1
            ].type.__slot__.options"
            :key="index"
            class="select-item"
          >
            <div class="select-line-icon option-drag">
              <i class="el-icon-s-operation" />
            </div>
            <el-input v-model="item.label" placeholder="选项名" size="small" />
            <div class="close-btn select-line-icon">
              <i class="el-icon-remove-outline" @click="delOption(index)" />
            </div>
          </div>
        </draggable>
        <div style="margin-left: 20px">
          <el-button
            style="padding-bottom: 0"
            icon="el-icon-circle-plus-outline"
            type="text"
            @click="addOption"
          >
            添加选项
          </el-button>
          <a style="margin-left: 96px">设置选项来源</a>
        </div>
      </template>
    </template>
    <float-table-header ref="floatTableHeader" :headers="activeData.headers" />
  </div>
</template>

<script>
// 表格组件的属性配置设置
import draggable from "vuedraggable";
import {
  input,
  textarea,
  number,
  link,
  mail,
  phone,
  select,
  date,
  address,
} from "../config/config_common";
import FloatTableHeader from "./float-table-header";
export default {
  name: "RightPanelTable",
  props: ["activeData"],
  components: {
    draggable,
    FloatTableHeader,
  },
  data() {
    return {
      cols: this.activeData.columns.length,
    };
  },
  methods: {
    addCol() {
      this.activeData.selectedCol = -1;
      let key =
        this.activeData.columns[this.activeData.columns.length - 1].key + 1;
      let label = "列" + key;
      let props = "col" + key;
      this.activeData.columns.push({
        key,
        label,
        props,
        type: input,
      });
    },

    delCol(key) {
      this.activeData.selectedCol = -1;
      this.activeData.columns = this.activeData.columns.filter(
        (column) => column.key != key
      );
    },

    dragEnd(obj) {
      if (obj.oldIndex + 1 == this.activeData.selectedCol) {
        this.activeData.selectedCol = obj.newIndex + 1;
      }
    },

    tagChange(val) {
      if (val == "单行文本") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(input));
      } else if (val == "多行文本") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(textarea));
      } else if (val == "数字") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(number));
      } else if (val == "链接") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(link));
      } else if (val == "邮箱") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(mail));
      } else if (val == "电话") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(phone));
      } else if (val == "地址") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(address));
      } else if (val == "下拉选择") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(select));
      } else if (val == "日期选择") {
        this.activeData.columns[this.activeData.selectedCol - 1].type =
          JSON.parse(JSON.stringify(date));
      }
    },

    delOption(index) {
      this.activeData.columns[
        this.activeData.selectedCol - 1
      ].type.options.splice(index, 1);
    },

    addOption() {
      this.activeData.columns[
        this.activeData.selectedCol - 1
      ].type.options.push({
        label: "选项",
        value: "",
      });
    },

    changeTimeFormat(val, column) {
      column["value-format"] = val;
      if (val === "yyyy-MM") {
        this.$set(column, "dateType", "month");
      } else if (val === "yyyyMM") {
        this.$set(column, "dateType", "month");
      } else {
        this.$set(column, "dateType", "year");
      }
    },

    changeFloatCol(newVal, oldVal) {
      if (newVal > oldVal) {
        this.activeData.selectedCol = -1;
        for (let i = 0; i < newVal - oldVal; i++) {
          let key =
            this.activeData.columns[this.activeData.columns.length - 1].key + 1;
          let label = "列" + key;
          let props = "col" + key;
          this.activeData.columns.push({
            key,
            props,
            type: input,
          });
          this.activeData.headers.forEach((element) => {
            element.push(label);
          });
        }
      } else {
        for (let i = 0; i < oldVal - newVal; i++) {
          this.activeData.columns.pop();
          this.activeData.headers.forEach((element) => {
            if (element.length > 1) {
              element.pop();
            }
          });
        }
      }
    },

    showHeader() {
      this.$refs.floatTableHeader.show();
    },
  },
};
</script>

<style lang="scss" scoped>
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
