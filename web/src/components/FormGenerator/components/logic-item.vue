<template>
  <div class="item">
    <el-select
      v-model="term"
      size="small"
      style="width: 25%"
      @change="changeTerm"
    >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      size="small"
      style="width: 15%"
      v-model="calFlag"
      :disabled="calFlagList.length == 0"
      @change="changeCalFlag"
    >
      <el-option
        v-for="(item, index) in calFlagList"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input-number
      :disabled="calFlagList.length == 0"
      v-if="inputType == 1"
      v-model="termVal"
      @change="changeTermVal"
      style="width: 55%"
    />
    <el-date-picker
      :disabled="calFlagList.length == 0"
      v-else-if="inputType == 2"
      v-model="termVal"
      @change="changeTermVal"
      style="width: 55%"
    />
    <el-select
      :disabled="calFlagList.length == 0"
      v-else-if="inputType == 3"
      multiple
      v-model="termVals"
      @change="changeTermVal"
      style="width: 55%"
    >
      <el-option
        v-for="(item, index) in termOptions"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-input
      v-else
      v-model="termVal"
      style="width: 55%"
      @input="changeTermVal"
      :disabled="calFlagList.length == 0"
    />
  </div>
</template>

<script>
export default {
  name: "LogicItem",
  props: ["value", "drawingList"],
  data() {
    return {
      calFlagList: [],
      term: "",
      calFlag: "",
      inputType: 0,
      termVal: "",
      termVals: [],
      termOptions: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.term = val.term;
        this.calFlag = val.calFlag;
        if (val.termVal instanceof Array) {
          this.termVals = val.termVal;
        } else {
          this.termVal = val.termVal;
        }
      },
      immediate: true,
    },
    term(newVal, oldVal) {
      this.resetTerm();
      if (newVal == "") {
        return;
      }
      let component = this.drawingList.filter(
        (item) => item.__config__.formId == newVal
      )[0];
      if (
        component.__config__.tag == "el-input" ||
        component.__config__.tag == "formLink" ||
        component.__config__.tag == "formMail" ||
        component.__config__.tag == "formAddress"
      ) {
        this.calFlagList = [
          { label: "等于", value: "==" },
          { label: "不等于", value: "!=" },
        ];
        this.inputType = 0;
      } else if (
        component.__config__.tag == "el-input-number" ||
        component.__config__.tag == "el-date-picker"
      ) {
        this.inputType = component.__config__.tag == "el-input-number" ? 1 : 2;
        this.calFlagList = [
          { label: "等于", value: "==" },
          { label: "不等于", value: "!=" },
          { label: "大于", value: ">" },
          { label: "小于", value: "<" },
          { label: "大于等于", value: ">=" },
          { label: "小于等于", value: "<=" },
        ];
      } else {
        this.calFlagList = [
          { label: "等于任意值", value: "||" },
          { label: "不等于任何值", value: "&&" },
        ];
        this.termOptions = component.__slot__.options;
        this.inputType = 3;
      }
    },
  },
  computed: {
    options() {
      let optionList = [];
      this.drawingList.forEach((item) => {
        if (
          item.__config__.tag != "formDivider" &&
          item.__config__.layout != "tableLayout"
        ) {
          optionList.push({
            label: item.__config__.label,
            value: item.__config__.formId,
          });
        }
      });
      return optionList;
    },
  },

  methods: {
    resetTerm() {
      this.calFlag = "";
      this.calFlagList = [];
      this.termVal = "";
      this.termVals = [];
    },

    changeCalFlag(val) {
      this.calFlag = val;
      this.handlerVal();
    },

    changeTerm(val) {
      this.term = val;
      this.handlerVal();
    },

    changeTermVal(val) {
      if (this.inputType != 3) {
        this.termVals = val;
      } else {
        this.termVal = val;
      }
      this.handlerVal();
    },

    handlerVal() {
      if (this.inputType != 3) {
        this.$emit("input", {
          term: this.term,
          calFlag: this.calFlag,
          termVal: this.termVals,
        });
      } else {
        this.$emit("input", {
          term: this.term,
          calFlag: this.calFlag,
          termVal: this.termVal,
        });
      }
    },
  },
};
</script>

<style>
</style>