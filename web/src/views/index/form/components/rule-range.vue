<template>
  <div>
    <div>
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
    <div v-for="(item, itemIndex) in dataRangeVal" :key="itemIndex">
      <div v-for="(data, leftIndex) in item.left" :key="leftIndex">
        <el-select
          placeholder="请选择"
          v-model="data.operator"
          v-if="leftIndex != 0"
        >
          <el-option
            v-for="(item, calIndex) in calculateList"
            :key="calIndex"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select placeholder="请选择" v-model="data.field">
          <el-option label="表单字段" :value="0" />
          <el-option label="固定值" :value="1" />
        </el-select>
        <el-select
          v-if="data.field == 0"
          v-model="data.value"
          placeholder="请选择表单字段"
        >
          <el-option
            v-for="item in drawingList"
            :key="item.id"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input v-else v-model="data.value" placeholder="请输入" />
        <i class="el-icon-circle-plus-outline"></i>
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

      <div v-for="(data, rightIndex) in item.right" :key="rightIndex">
        <el-select
          placeholder="请选择"
          v-model="data.operator"
          v-if="rightIndex != 0"
        >
          <el-option
            v-for="(item, calIndex) in calculateList"
            :key="calIndex"
            :label="item"
            :value="item"
          />
        </el-select>
        <el-select placeholder="请选择" v-model="data.field">
          <el-option label="表单字段" :value="0" />
          <el-option label="固定值" :value="1" />
        </el-select>
        <el-select
          v-if="data.field == 0"
          v-model="data.value"
          placeholder="请选择表单字段"
        >
          <el-option
            v-for="item in drawingList"
            :key="item.id"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
        <el-input v-else v-model="data.value" placeholder="请输入" />
        <i class="el-icon-circle-plus-outline"></i>
      </div>

      <div v-if="item.and_or != undefined">
        {{ item.and_or == "and" ? "并且" : "或者" }}
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
  mounted() {
    console.log(this.drawingList);
  },
  method: {
    del(index) {},

    add() {},
  },
};
</script>

<style lang="scss" scoped></style>
