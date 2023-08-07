<template>
  <div>
    <div>
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        size="small"
        @click="add(1)"
      >
        且条件
      </el-button>
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        size="small"
        @click="add(0)"
      >
        或条件
      </el-button>
    </div>
    <div v-for="(item, index) in dateRule" :key="index">
      <div class="innerForm">
        <div v-if="dateRule.length != 1">
          <i class="el-icon-circle-close" @click="delDateAndOr(index)" />
        </div>
        <div>
          <el-select placeholder="请选择" v-model="item.left[0].field">
            <el-option label="表单字段" :value="0" />
            <el-option label="固定值" :value="1" />
          </el-select>
          <el-date-picker
            v-model="item.left[0].value"
            style="margin-left: 12px"
            placeholder="请选择日期"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
          />
        </div>
        <div>
          <el-select placeholder="请选择" v-model="item.operator">
            <el-option
              v-for="(item, index) in operatorList"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
        <div>
          <el-select placeholder="请选择" v-model="item.right[0].field">
            <el-option label="表单字段" :value="0" />
            <el-option label="固定值" :value="1" />
          </el-select>
          <el-date-picker
            v-model="item.right[0].value"
            placeholder="请选择日期"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
          />
        </div>
      </div>
      <div v-if="item.and_or != ''">
        {{ item.and_or == "and" ? "并且" : "或者" }}
      </div>
    </div>
  </div>
</template>

<script>
//表单时间校验
export default {
  name: "RuleDate",
  props: ["value", "drawingList", "verifyMode"],
  data() {
    return {
      dateRule: this.value,
      operatorList: ["<", "<=", "=", ">=", ">", "!="],
    };
  },
  watch: {
    value(newVal) {
      this.dateRule = newVal;
    },
  },
  computed: {
    dateList() {
      return this.drawingList;
    },
  },
  methods: {
    delDateAndOr(index) {
      this.dateRule.splice(index, 1);
      this.dateRule[this.dateRule.length - 1].and_or = "";
      this.$emit("input", this.dateRule);
    },

    add(andOr) {
      if (andOr == 0) {
        this.dateRule[this.dateRule.length - 1].and_or = "and";
      } else {
        this.dateRule[this.dateRule.length - 1].and_or = "or";
      }
      let newRule = {
        left: [
          {
            field: 0,
            operator: "",
            type: this.verifyMode,
            value: "",
          },
        ],
        operator: "",
        right: [
          {
            field: 0,
            operator: "",
            type: this.verifyMode,
            value: "",
          },
        ],
        and_or: "",
      };
      this.dateRule.push(newRule);
      this.$emit("input", this.dateRule);
    },
  },
};
</script>

<style scoped lang="scss"></style>
