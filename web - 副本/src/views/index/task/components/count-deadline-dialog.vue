<template>
  <el-dialog
    title="配置统计截止时间"
    :visible="visible"
    :append-to-body="true"
    width="30%"
    @close="close"
  >
    <el-form
      :model="deadlineForm"
      ref="deadlineForm"
      size="small"
      label-width="120px"
      :rules="rules"
      v-loading="loading"
    >
      <el-form-item label="表单名称">
        <el-input
          v-model="deadlineForm.name"
          disabled
          v-if="!isBatch"
        ></el-input>
        <el-select
          v-else
          style="width: 100%"
          v-model="deadlineForm.names"
          multiple
          disabled
        >
        </el-select>
      </el-form-item>
      <el-form-item label="统计截止时间" prop="statisticsEndTime">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd"
          v-model="deadlineForm.statisticsEndTime"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <mbutton name="取消" @click="close" />
      <mbutton name="确定" type="primary" @click="handleSubmit" />
    </div>
  </el-dialog>
</template>

<script>
import { configEndTime } from "@/api/task";
export default {
  name: "CountDeadlineDialog",
  props: ["taskId", "endTime"],
  data() {
    return {
      visible: false,
      loading: false,
      deadlineForm: {},
      isBatch: false,
      rules: {
        formIds: [{ required: true, message: "请选择表单名称" }],
        statisticsEndTime: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (Date.parse(value) > Date.parse(this.endTime)) {
                  callback(new Error("统计截止时间需小于任务截止时间"));
                }
                callback();
              }
              callback(new Error("请选择统计截止时间"));
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    edit(records) {
      if (records.length > 1) {
        this.isBatch = true;
        this.$set(this.deadlineForm, "statisticsEndTime", "");
        this.$set(
          this.deadlineForm,
          "names",
          records.map((item) => item.formName)
        );
        this.deadlineForm.formIds = records.map((item) => item.formId);
      } else {
        this.isBatch = false;
        this.$set(
          this.deadlineForm,
          "statisticsEndTime",
          records[0].statisticsEndTime
        );
        this.$set(this.deadlineForm, "name", records[0].formName);
        this.deadlineForm.formIds = [records[0].formId];
      }
      this.$nextTick(() => this.$refs.deadlineForm.clearValidate());
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$emit("close");
    },

    handleSubmit() {
      this.$refs.deadlineForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let deadlineForm = { taskId: this.taskId, ...this.deadlineForm };
          configEndTime(deadlineForm)
            .then((res) => {
              if (res.state) {
                this.$message.success(res.message);
                this.$emit("refresh", this.deadlineForm);
                this.close();
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => (this.loading = false));
        }
      });
    },
  },
};
</script>

<style></style>
