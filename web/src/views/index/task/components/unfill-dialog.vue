<template>
  <el-dialog
    title="不填报原因"
    :visible="visible"
    @close="close"
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
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { configFillStatus } from "@/api/task";
export default {
  name: "UnfillDialog",
  data() {
    return {
      unfillForm: {},
      unfileRules: {
        remark: [{ required: true, message: "请输入不可填报原因" }],
      },
      visible: false,
    };
  },

  methods: {
    close() {
      this.visible = false;
      this.$refs.unfillForm.resetFields();
    },

    show(row) {
      const { taskId, formId, isCanFill } = row;
      this.unfillForm = { taskId, formId, isCanFill: !isCanFill };
      this.visible = true;
    },

    handleSubmit() {
      this.$refs.unfillForm.validate((valid) => {
        if (valid) {
          configFillStatus(this.unfillForm).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.$emit("refresh");
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
