<template>
  <el-dialog
    :title="isBatch ? '批量配置统计截止时间' : '统计截止时间'"
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
      <el-form-item label="表单名称" prop="formIds">
        <el-select
          style="width: 100%"
          v-model="deadlineForm.formIds"
          placeholder="请选择"
          multiple
          clearable
          filterable
          :disabled="!isBatch"
        >
          <el-option
            v-for="item in formList"
            :key="item.formId"
            :label="item.formName"
            :value="item.formId"
          />
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
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { configEndTime } from "@/api/task";
export default {
  name: "CountDeadlineDialog",
  props: ["taskId"],
  data() {
    return {
      visible: false,
      isBatch: false,
      loading: false,
      endTime: "",
      deadlineForm: { formIds: [], statisticsEndTime: "" },
      formList: [],
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
    show(isBatch, selectedFormList, formList, endTime) {
      this.isBatch = isBatch;
      this.formList = formList;
      this.endTime = endTime;
      this.deadlineForm.formIds = selectedFormList.map((form) => form.formId);
      if (!isBatch) {
        this.deadlineForm.statisticsEndTime =
          selectedFormList[0].statisticsEndTime;
      } else {
        this.deadlineForm.statisticsEndTime = "";
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$refs.deadlineForm.resetFields();
    },

    handleSubmit() {
      this.$refs.deadlineForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let deadlineForm = { taskId: this.taskId, ...this.deadlineForm };
          configEndTime(deadlineForm)
            .then((res) => {
              if (res.state) {
                //this.$message.success(res.message);
                this.$emit("refresh");
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
