<template>
  <el-dialog
    :title="isBatch ? '批量配置权限' : '配置权限'"
    :visible="visible"
    width="40%"
    :append-to-body="true"
    @close="close"
  >
    <el-form
      size="small"
      v-model="permissionForm"
      ref="permissionForm"
      label-width="80px"
    >
      <el-form-item label="表单名称">
        <el-cascader
          clearable
          filterable
          :props="{ multiple: true }"
          v-model="permissionForm.name"
          :disabled="!isBatch"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="负责部门">
        <el-cascader
          clearable
          filterable
          v-model="permissionForm.charge"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="协作部门">
        <el-cascader
          clearable
          filterable
          v-model="permissionForm.assist"
          style="width: 100%"
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
  name: "PermissionDialog",
  data() {
    return {
      isBatch: false,
      visible: false,
      permissionForm: {},
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$refs.permissionForm.resetFields();
    },

    handleSubmit() {
      this.$refs.permissionForm.validate((valid) => {
        //TODO
      });
    },

    show(isBatch) {
      this.isBatch = isBatch;
      this.visible = true;
    },
  },
};
</script>

<style>
</style>