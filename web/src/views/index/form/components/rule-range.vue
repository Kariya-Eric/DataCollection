<template>
  <div class="typeDiv">
    <div style="margin-left: 18px; margin-bottom: 12px">
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        size="small"
        @click="addAnd"
      >
        且条件
      </el-button>
      <el-button
        icon="el-icon-circle-plus-outline"
        plain
        size="small"
        @click="addOr"
      >
        或条件
      </el-button>
    </div>
    <div v-for="(item, index) in dataRangeList" :key="index">
      <div class="innerForm">
        <div
          style="text-align: right; font-size: 18px"
          v-if="dataRangeList.length != 1"
        >
          <i class="el-icon-circle-close" @click="delAndOr(index)" />
        </div>
        <el-form-item label="公式左侧">
          <div
            v-for="(c, i) in item.caculateList"
            :key="i"
            style="margin-top: 8px"
          >
            <el-row>
              <el-col :span="6">
                <el-select
                  v-model="c.calFlag"
                  placeholder="请选择四则运算符"
                  style="margin-right: 8px"
                >
                  <el-option label="+" value="+" />
                  <el-option label="-" value="-" />
                  <el-option label="*" value="*" />
                  <el-option label="/" value="/" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select placeholder="请选择" v-model="c.calField">
                  <el-option label="表单字段" :value="0" />
                  <el-option label="固定值" :value="1" />
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select
                  v-if="c.calField == 0"
                  v-model="c.calValue"
                  placeholder="请选择表单字段"
                >
                  <el-option label="数据范围1" value="数据范围1" />
                  <el-option label="数据范围2" value="数据范围2" />
                </el-select>
                <el-input v-else v-model="c.calValue" placeholder="请输入" />
              </el-col>
              <el-col :span="2">
                <div
                  class="close-btn select-line-icon"
                  style="margin-left: 12px"
                >
                  <i
                    class="el-icon-remove-outline"
                    @click="delCaculate(index, i)"
                  />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="判断符">
          <el-select placeholder="请选择" v-model="item.operator">
            <el-option
              v-for="(item, index) in operatorList"
              :key="index"
              :label="item"
              :value="item"
            />
            <el-option label="!=" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="公式右侧"> </el-form-item>
      </div>
      <div v-if="item.and_or != undefined" style="margin-left: 16px">
        {{ item.and_or == "and" ? "并且" : "或者" }}
      </div>
    </div>
  </div>
</template>

<script>
//规则校验数据范围

export default {
  name: "RuleRange",
  props: ["dataRange"],

  data() {
    return {
      dataRangeList: [],
      operatorList: ["<", "<=", "=", ">=", ">", "!="],
    };
  },

  method: {
    addAnd() {},

    addOr() {},

    delAndOr() {},
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
  /deep/.el-form-item {
    margin-bottom: 0px;
  }
  .innerForm {
    margin: 12px;
    padding: 12px 12px 0px 12px;
    border: 1px dashed #abcaf9;
    border-radius: 5px;
    /deep/.el-form-item {
      margin-bottom: 12px;
    }
  }
  .formItem {
    display: flex;
    margin-bottom: 12px;
    & .close-btn {
      font-size: 20px;
      margin-left: 12px;
      cursor: pointer;
      color: #f56c6c;
    }
    & .add-btn {
      font-size: 20px;
      margin-left: 12px;
      cursor: pointer;
    }
  }
}
</style>