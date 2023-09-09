<template>
  <el-dialog
    :title="title"
    :visible="visible"
    v-if="visible"
    @close="close"
    width="45%"
    v-loading="loading"
    :append-to-body="true"
  >
    <div class="dialogDiv">
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        :rules="rules"
        label-width="120px"
        size="small"
      >
        <el-form-item label="校验名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入校验名称" />
        </el-form-item>
        <el-form-item label="校验模式" prop="verifyMode">
          <el-radio-group v-model="ruleForm.verifyMode">
            <el-radio label="current">表内校验</el-radio>
            <el-radio label="other">表间校验</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验类型" prop="type">
          <el-radio-group v-model="ruleForm.type">
            <el-radio
              v-for="item in typeList"
              :key="item.value"
              :label="item.value"
              >{{ item.name }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="校验失败提示" prop="message">
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
        <el-form-item
          v-if="ruleForm.type == 'dataRange'"
          label-width="0"
          prop="verificationFormulas"
        >
          <rule-range
            ref="verificationFormulas"
            v-model="ruleForm.verificationFormulas"
            :drawingList="drawingList"
          />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.type == 'unique'"
          label-width="0"
          prop="verificationFormulas"
        >
          <rule-unique
            ref="verificationFormulas"
            v-model="ruleForm.verificationFormulas"
            :drawingList="drawingList"
          />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.type == 'dateTime'"
          label-width="0"
          prop="verificationFormulas"
        >
          <rule-date
            ref="verificationFormulas"
            v-model="ruleForm.verificationFormulas"
            :drawingList="drawingList"
          />
        </el-form-item>
        <el-form-item
          v-if="ruleForm.type == 'other'"
          label-width="0"
          prop="verificationFormulas"
        >
          <rule-other
            ref="verificationFormulas"
            v-model="ruleForm.verificationFormulas"
          />
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
import RuleUnique from "./rule-unique";
import RuleDate from "./rule-date";
import { addRule, updateRule } from "@/api/form";
export default {
  name: "RuleDialog",
  components: { RuleOther, RuleRange, RuleUnique, RuleDate },
  props: ["drawingList", "formId"],
  data() {
    return {
      visible: false,
      loading: false,
      updateFlag: false,
      ruleForm: {
        name: "",
        type: "",
        verifyMode: "",
        message: "",
        enabledFlag: 0,
      },
      rules: {
        name: [{ required: true, message: "请输入校验名称" }],
        type: [{ required: true, message: "请输入校验类型" }],
        verifyMode: [{ required: true, message: "请输入校验模式" }],
        message: [{ required: true, message: "请输入校验失败提示" }],
        verificationFormulas: [
          {
            validator: async (rule, value, callback) => {
              let result = await this.$refs.verificationFormulas.validate();
              if (result) {
                callback(new Error(result));
              }
              callback();
            },
          },
        ],
      },
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
    "ruleForm.verifyMode"(newVal, oldVal) {
      if (oldVal != "") {
        this.$set(this.ruleForm, "type", "");
      }
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
    "ruleForm.type"(newVal) {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.clearValidate(["verificationFormulas"]);
        if (newVal == "dataRange") {
          let dataRange = [
            {
              left: [{ operator: "", type: "", value: "" }],
              operator: "",
              right: [{ operator: "", type: "", value: "" }],
              and_or: "",
            },
          ];
          this.$set(this.ruleForm, "verificationFormulas", dataRange);
        } else if (newVal == "unique") {
          let unique = [""];
          this.$set(this.ruleForm, "verificationFormulas", unique);
        } else if (newVal == "dateTime") {
          let dateTime = [
            {
              left: [{ operator: "", type: "", value: "" }],
              operator: "",
              right: [{ operator: "", type: "", value: "" }],
              and_or: "",
            },
          ];
          this.$set(this.ruleForm, "verificationFormulas", dateTime);
        } else if (newVal == "other") {
          this.$set(this.ruleForm, "verificationFormulas", "");
        } else if (newVal == "exclusivity") {
        } else if (newVal == "consistency") {
        }
      }
    },
  },
  methods: {
    show(info) {
      if (info) {
        this.updateFlag = true;
        this.ruleForm = JSON.parse(JSON.stringify(info));
      } else {
        this.updateFlag = false;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        name: "",
        type: "",
        verifyMode: "",
        message: "",
        enabledFlag: 0,
      };
    },

    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.updateFlag) {
            this.handleUpdate();
          } else {
            this.handleAdd();
          }
        }
      });
    },

    handleAdd() {
      this.loading = true;
      addRule({ ...this.ruleForm, formId: this.formId })
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
            this.close();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleUpdate() {
      this.loading = true;
      updateRule(this.ruleForm)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
            this.close();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
        });
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
