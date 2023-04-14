<template>
  <el-dialog
    title="复制权限"
    @close="close"
    width="30%"
    :visible="visible"
    :append-to-body="true"
  >
    <el-form
      size="small"
      v-model="permissionForm"
      ref="permissionForm"
      label-width="80px"
    >
      <el-form-item label="任务名称">
        <el-select
          clearable
          v-model="permissionForm.name"
          style="width: 100%"
        ></el-select>
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
  name: "CopyPermissionDialog",
  data() {
    return {
      visible: false,
      permissionForm: {},
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$refs.permissionForm.resetFields();
    },
    show() {
      this.visible = true;
    },
    handleSubmit() {
      this.$refs.permissionForm.validate((valid) => {
        //TODO
      });
    },
  },
};
</script>

<style>
</style>