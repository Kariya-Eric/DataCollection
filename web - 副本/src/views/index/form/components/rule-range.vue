<template>
  <div class="typeDiv">
    <div class="buttonDiv">
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        size="small"
        @click="add(0)"
      >
        且条件
      </el-button>
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        size="small"
        @click="add(1)"
      >
        或条件
      </el-button>
    </div>
    <div v-for="(range, index) in dataRangeVal" :key="index">
      <div v-if="range.and_or != ''" style="margin-left: 24px">
        {{ range.and_or == "and" ? "并且" : "或者" }}
      </div>
      <div class="innerDiv">
        <div v-if="dataRangeVal.length != 1" class="iconDiv">
          <i class="el-icon-circle-close" @click="del(index)" />
        </div>

        <el-row
          v-for="(left, leftIndex) in range.left"
          :key="'left' + leftIndex"
        >
          <el-col :span="3">
            <span v-if="leftIndex == 0"> 公式左侧 </span>
            <el-select
              v-else
              v-model="left.operator"
              placeholder="运算符"
              style="width: 100%"
              @change="(val) => changeLeftOpt(val, leftIndex, index)"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="item in calculateList"
                :key="'left' + item"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              placeholder="请选择"
              v-model="left.type"
              style="width: 100%"
              @change="(val) => changeLeftType(val, leftIndex, index)"
            >
              <el-option label="表单字段" value="field" />
              <el-option label="固定值" value="fixed" />
            </el-select>
          </el-col>
          <el-col :span="8" v-if="left.type != ''">
            <el-select
              v-if="left.type == 'field'"
              v-model="left.value"
              placeholder="请选择表单字段"
              style="width: 100%"
              @change="(val) => changeLeftValue(val, leftIndex, index)"
            >
              <el-option
                v-for="item in drawingList"
                :key="item.__config__.formId"
                :label="item.__config__.label"
                :value="item.__vModel__"
              />
            </el-select>
            <el-input
              v-else
              v-model="left.value"
              placeholder="请输入"
              @input="(val) => changeLeftValue(val, leftIndex, index)"
            />
          </el-col>
          <el-col :span="2">
            <div class="rowIcon" v-if="leftIndex == 0">
              <i class="el-icon-circle-plus-outline" @click="addLeft(index)" />
            </div>
            <div v-else class="rowIconDel">
              <i
                class="el-icon-remove-outline"
                @click="delLeft(leftIndex, index)"
              />
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3">判断符</el-col>
          <el-col :span="8">
            <el-select
              placeholder="请选择"
              v-model="range.operator"
              @change="(val) => changeOpt(val, index)"
            >
              <el-option
                v-for="(opt, optIndex) in operatorList"
                :key="optIndex"
                :label="opt"
                :value="opt"
              />
            </el-select>
          </el-col>
        </el-row>

        <el-row
          v-for="(right, rightIndex) in range.right"
          :key="'right' + rightIndex"
        >
          <el-col :span="3">
            <span v-if="rightIndex == 0"> 公式右侧 </span>
            <el-select
              v-else
              v-model="right.operator"
              placeholder="运算符"
              style="width: 100%"
              @change="(val) => changeRightOpt(val, rightIndex, index)"
            >
              <el-option
                :label="item"
                :value="item"
                v-for="item in calculateList"
                :key="'right' + item"
              />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select
              placeholder="请选择"
              v-model="right.type"
              style="width: 100%"
              @change="(val) => changeRightType(val, rightIndex, index)"
            >
              <el-option label="表单字段" value="field" />
              <el-option label="固定值" value="fixed" />
            </el-select>
          </el-col>
          <el-col :span="8" v-if="right.type != ''">
            <el-select
              v-if="right.type == 'field'"
              v-model="right.value"
              placeholder="请选择表单字段"
              style="width: 100%"
              @change="(val) => changeRightValue(val, rightIndex, index)"
            >
              <el-option
                v-for="item in drawingList"
                :key="item.__config__.formId"
                :label="item.__config__.label"
                :value="item.__vModel__"
              />
            </el-select>
            <el-input
              v-else
              v-model="right.value"
              placeholder="请输入"
              @input="(val) => changeRightValue(val, rightIndex, index)"
            />
          </el-col>
          <el-col :span="2">
            <div class="rowIcon" v-if="rightIndex == 0">
              <i class="el-icon-circle-plus-outline" @click="addRight(index)" />
            </div>
            <div v-else class="rowIconDel">
              <i
                class="el-icon-remove-outline"
                @click="delRight(rightIndex, index)"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
//规则校验数据范围

export default {
  name: "RuleRange",
  props: ["value", "drawingList"],

  data() {
    return {
      dataRangeVal: this.value,
      operatorList: ["<", "<=", "=", ">=", ">", "!="],
      calculateList: ["+", "-", "*", "/"],
    };
  },
  watch: {
    value(newVal) {
      this.dataRangeVal = newVal;
    },
  },
  methods: {
    del(index) {
      this.dataRangeVal.splice(index, 1);
      this.dataRangeVal[0].and_or = "";
      this.$emit("input", this.dataRangeVal);
    },

    add(andOr) {
      let range = {
        left: [{ operator: "", type: "", value: "" }],
        operator: "",
        right: [{ operator: "", type: "", value: "" }],
        and_or: andOr == 0 ? "and" : "or",
      };
      this.dataRangeVal.push(range);
      this.$emit("input", this.dataRangeVal);
    },

    changeLeftType(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].type = val;
      this.dataRangeVal[index].left[leftIndex].value = "";
      this.$emit("input", this.dataRangeVal);
    },
    changeRightType(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].type = val;
      this.dataRangeVal[index].right[rightIndex].value = "";
      this.$emit("input", this.dataRangeVal);
    },
    changeLeftValue(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].value = val;
      this.$emit("input", this.dataRangeVal);
    },
    changeRightValue(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].value = val;
      this.$emit("input", this.dataRangeVal);
    },

    changeRightOpt(val, rightIndex, index) {
      this.dataRangeVal[index].right[rightIndex].operator = val;
      this.$emit("input", this.dataRangeVal);
    },

    changeLeftOpt(val, leftIndex, index) {
      this.dataRangeVal[index].left[leftIndex].operator = val;
      this.$emit("input", this.dataRangeVal);
    },
    changeOpt(val, index) {
      this.dataRangeVal[index].operator = val;
      this.$emit("input", this.dataRangeVal);
    },

    addLeft(index) {
      let left = { operator: "", type: "", value: "" };
      this.dataRangeVal[index].left.push(left);
      this.$emit("input", this.dataRangeVal);
    },

    addRight(index) {
      let right = { operator: "", type: "", value: "" };
      this.dataRangeVal[index].right.push(right);
      this.$emit("input", this.dataRangeVal);
    },

    delLeft(leftIndex, index) {
      this.dataRangeVal[index].left.splice(leftIndex, 1);
      this.$emit("input", this.dataRangeVal);
    },

    delRight(rightIndex, index) {
      this.dataRangeVal[index].right.splice(rightIndex, 1);
      this.$emit("input", this.dataRangeVal);
    },

    validate() {
      let flag = true;
      outer: for (let i = 0; i < this.dataRangeVal.length; i++) {
        if (this.dataRangeVal[i].operator == "") {
          flag = false;
          break;
        }
        for (let j = 0; j < this.dataRangeVal[i].left.length; j++) {
          if (
            this.dataRangeVal[i].left[j].type == "" ||
            this.dataRangeVal[i].left[j].value == ""
          ) {
            flag = false;
            break outer;
          }
          if (j != 0 && this.dataRangeVal[i].left[j].operator == "") {
            flag = false;
            break outer;
          }
        }
        for (let j = 0; j < this.dataRangeVal[i].right.length; j++) {
          if (
            this.dataRangeVal[i].right[j].type == "" ||
            this.dataRangeVal[i].right[j].value == ""
          ) {
            flag = false;
            break outer;
          }
          if (j != 0 && this.dataRangeVal[i].right[j].operator == "") {
            flag = false;
            break outer;
          }
        }
      }
      return new Promise((resolve, reject) => {
        if (flag) {
          resolve(undefined);
        } else {
          resolve("数据范围校验组合中不能为空！");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.typeDiv {
  background-color: #f5f8fd;
  min-height: 200px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
  padding-top: 12px;
  padding-bottom: 24px;
  .buttonDiv {
    margin: 0px 0px 12px 12px;
  }
  .innerDiv {
    margin: 12px;
    padding: 12px 12px 0px 12px;
    border: 1px dashed #abcaf9;
    border-radius: 5px;
    .iconDiv {
      position: relative;
      z-index: 11;
      float: right;
      cursor: pointer;
      margin-top: -8px;
      font-size: 18px;
      color: #f56c6c;
    }
    /deep/ .el-row {
      margin-bottom: 8px;
    }
    /deep/ .el-col {
      margin-right: 8px;
    }
    .rowIcon {
      font-size: 16px;
      color: #2f68bd;
      cursor: pointer;
    }
    .rowIconDel {
      font-size: 16px;
      color: #f56c6c;
      cursor: pointer;
    }
  }
}
</style>
