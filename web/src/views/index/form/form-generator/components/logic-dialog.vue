<template>
  <div>
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      @close="onClose"
      title="字段显隐规则"
    >
      <el-row> 满足以下条件时 </el-row>
      <el-button type="primary" size="small" icon="el-icon-plus"
        >添加条件</el-button
      >
      <el-row>
        <el-select
          v-model="termOption"
          placeholder="请选择字段"
          size="small"
          style="width: 30%"
          clearable
        >
          <el-option
            v-for="(item, index) in termOptions"
            :key="index"
            :label="item.__config__.label"
            :value="item"
          />
        </el-select>
        <el-select
          size="small"
          style="width: 20%"
          v-model="equalTerm"
          :disabled="termOptions.length == 0"
        >
          <el-option
            label="等于"
            :value="0"
            v-if="
              termOption.__config__.tag === 'el-input' ||
              termOption.__config__.tag === 'customMail' ||
              termOption.__config__.tag === 'customPhone' ||
              termOption.__config__.tag === 'customAddress'
            "
          />
          <el-option label="不等于" :value="1" />
          <el-option label="等于任意一个" :value="2" />
          <el-option label="不等于任意一个" :value="3" />
        </el-select>
        <el-select
          size="small"
          style="width: 49%"
          v-model="selectOption"
          :disabled="termOptions.length == 0"
        >
        </el-select>
      </el-row>
      <el-row> 显示以下字段 </el-row>
      <el-row>
        <el-select
          v-model="selectOption"
          placeholder="请先添加条件"
          size="small"
          style="width: 100%"
        >
        </el-select>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDrawingList } from "../utils/db";
export default {
  name: "LogicDialog",
  data() {
    return {
      termOptions: [],
      termOption: "",
      equalTerm: 0,
      selectOption: "",
      visible: false,
    };
  },
  methods: {
    onClose() {
      this.visible = false;
    },
    show(data) {
      this.visible = true;
      this.termOptions = getDrawingList().filter(
        (item) => item.__config__.formId
      );
    },

    handleSubmit() {
      this.$emit("setLogic", this.selectOption, this.hiddenList);
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.borderDiv {
  border: 1px solid;
  height: 480px;
}
/deep/ .el-radio {
  display: block;
  margin: 10px 0;
}
/deep/ .el-checkbox {
  display: block;
  margin: 10px 0;
}
</style>
