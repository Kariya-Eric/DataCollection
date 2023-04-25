<template>
  <div>
    <el-dialog :append-to-body="true" :visible="visible" @close="onClose">
      <el-row :gutter="24">
        <el-col :span="12">
          <div>如果选中</div>
          <div class="borderDiv">
            <el-radio-group v-model="selectOption">
              <el-radio
                v-for="(option, index) in options"
                :key="index"
                :label="option.value"
                >{{ option.label }}</el-radio
              >
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="12">
          <div>不显示以下字段</div>
          <div class="borderDiv">
            <el-checkbox-group v-model="hiddenList">
              <el-checkbox
                v-for="(drawingItem, index) in drawingList"
                :key="index"
                :label="drawingItem.__config__.formId"
                >{{ drawingItem.__config__.label }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="onClose">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDrawingList } from "../utils/db";
export default {
  name: "LogicDialog",
  data() {
    return {
      visible: false,
      options: [],
      selectOption: "",
      drawingList: [],
      hiddenList: [],
    };
  },
  methods: {
    onClose() {
      this.visible = false;
      this.hiddenList = [];
      this.selectOption = "";
    },
    show(data) {
      this.visible = true;
      this.options = data.__slot__.options;
      let cachedDrawingList = getDrawingList();
      this.drawingList = cachedDrawingList.filter(
        (item) =>
          item.__config__.formId &&
          item.__config__.formId !== data.__config__.formId
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