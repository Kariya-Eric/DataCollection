<template>
  <el-dialog
    :title="title"
    :visible="visible"
    v-if="visible"
    @close="close"
    width="45%"
    :append-to-body="true"
  >
    <div class="dialogDiv">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="100px"
        size="small"
      >
        <el-form-item label="校验名称">
          <el-input v-model="ruleForm.name" placeholder="请输入检验名称" />
        </el-form-item>
        <el-form-item label="校验模式">
          <el-radio-group v-model="ruleForm.verifyMode">
            <el-radio label="current">表内校验</el-radio>
            <el-radio label="other">表间校验</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验类型">
          <el-radio-group v-model="ruleForm.type">
            <el-radio
              v-for="item in typeList"
              :key="item.value"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验失败提示">
          <el-input
            type="textarea"
            v-model="ruleForm.message"
            placeholder="请输入校验失败提示"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch
            v-model="ruleForm.enabledFlag"
            :inactive-value="0"
            :active-value="1"
          />
        </el-form-item>
        <el-form-item v-if="ruleForm.type == 'dataRange'">
          <rule-range
            v-model="ruleForm.verificationFormulas"
            :drawingList="drawingList"
          />
        </el-form-item>
        <el-form-item v-if="ruleForm.type == 'other'">
          <rule-other v-model="ruleForm.verificationFormulas" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import RuleOther from "./rule-other";
import RuleRange from "./rule-range";
export default {
  name: "RuleDialog",
  components: { RuleOther, RuleRange },
  props: ["drawingList"],
  data() {
    return {
      visible: false,
      updateFlag: false,
      ruleForm: {},
      rules: {},
      typeList: [
        { name: "数据范围校验", value: "dataRange" },
        { name: "唯一性校验", value: "unique" },
        { name: "时间日期校验", value: "dateTime" },
        { name: "自定义校验", value: "other" },
      ],
    };
  },
  computed: {
    title() {
      let mode = "";
      if (this.ruleForm.verifyMode === "current") {
        mode = "（表内校验）";
      } else if (this.ruleForm.verifyMode === "other") {
        mode = "（表间校验）";
      }
      return this.updateFlag ? `修改校验${mode}` : `添加校验${mode}`;
    },
  },
  watch: {
    "ruleForm.verifyMode"(newVal) {
      this.$set(this.ruleForm, "type", "");
      if (newVal == "current") {
        this.typeList = [
          { name: "数据范围校验", value: "dataRange" },
          { name: "唯一性校验", value: "unique" },
          { name: "时间日期校验", value: "dateTime" },
          { name: "自定义校验", value: "other" },
        ];
      } else {
        this.typeList = [
          { name: "数据范围校验", value: "dataRange" },
          { name: "排他性校验", value: "exclusivity" },
          { name: "一致性校验", value: "consistency" },
          { name: "自定义校验", value: "other" },
        ];
      }
    },
  },
  methods: {
    show(info) {
      if (info) {
        this.updateFlag = true;
      } else {
        this.updateFlag = false;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.ruleForm = {};
      this.$refs.ruleForm.resetFields();
    },

    handleSubmit() {
      console.log(this.ruleForm);
      this.$message.warning("等待后端接口");
      //this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogDiv {
  height: 60vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
