<template>
  <div>
    <div v-for="(field, index) in fieldList" :key="index">
      <el-select placeholder="请选择" v-model="field.type">
        <el-option label="表单字段" :value="0" />
        <el-option label="固定值" :value="1" />
      </el-select>
      <el-select
        v-if="field.type == 0"
        v-model="field.value"
        placeholder="请选择表单字段"
        @change="change"
      >
        <el-option
          v-for="item in drawingList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-else
        v-model="field.value"
        placeholder="请输入"
        @input="input"
      />
    </div>
  </div>
</template>

<script>
// 表单数据范围字段
export default {
  name: "RuleRangeField",
  props: ["value", "drawingList"],
  watch: {
    value(newVal) {
      this.fieldList = newVal;
    },
  },
  data() {
    return {
      fieldList: [],
    };
  },
  methods: {
    input(val) {
      this.leftVal = val;
      this.$emit("input", val);
    },

    change(value) {
      this.leftVal = value;
      this.$emit("input", val);
    },
  },
};
</script>

<style>
</style>