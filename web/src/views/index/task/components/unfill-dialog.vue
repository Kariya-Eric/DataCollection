<template>
  <el-dialog
    title="不填报原因"
    :visible="visible"
    @close="close"
    :append-to-body="true"
  >
    <el-form size="small" ref="unfillForm" v-model="unfillForm">
      <el-form-item>
        <el-input
          type="textarea"
          :rows="6"
          show-word-limit
          placeholder="请输入不填报原因"
          v-model="unfillForm.reason"
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
export default {
  name: "UnfillDialog",
  data() {
    return {
      unfillForm: {},
      visible: false,
    };
  },

  methods: {
    close() {
      this.visible = false;
      this.$refs.unfillForm.resetFields();
    },

    show() {
      this.visible = true;
    },

    handleSubmit() {
      this.$refs.unfillForm.validate((valid) => {
        //TODO
      });
    },
  },
};
</script>

<style>
</style>