<template>
  <el-dialog
    title="不填报原因"
    :visible="visible"
    @close="close"
    width="35%"
    :append-to-body="true"
  >
    <el-form
      size="small"
      ref="unfillForm"
      :model="unfillForm"
      :rules="unfileRules"
    >
      <el-form-item prop="remark">
        <el-input
          type="textarea"
          :rows="6"
          show-word-limit
          placeholder="请输入不填报原因"
          v-model="unfillForm.remark"
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
import { configFillStatus } from "@/api/task";
export default {
  name: "UnfillDialog",
  props: ["taskId"],
  data() {
    return {
      unfillForm: {},
      unfileRules: {
        remark: [{ required: true, message: "请输入不填报原因" }],
      },
      visible: false,
    };
  },

  methods: {
    close() {
      this.visible = false;
      this.$nextTick(() => {
        this.$refs.unfillForm.resetFields();
      });
    },

    edit(row) {
      const { formId, isCanFill } = row;
      this.unfillForm = { taskId: this.taskId, formId, isCanFill: !isCanFill };
      this.visible = true;
    },

    handleSubmit() {
      this.$refs.unfillForm.validate((valid) => {
        if (valid) {
          configFillStatus(this.unfillForm).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.$emit("refresh", this.unfillForm);
              this.close();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
  },
};
</script>

<style></style>
