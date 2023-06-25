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
      :model="permissionForm"
      ref="permissionForm"
      label-width="80px"
      :rules="rules"
      v-loading="loading"
    >
      <el-form-item label="表单名称" prop="formIds">
        <el-select
          style="width: 100%"
          v-model="permissionForm.formIds"
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
      <el-form-item label="负责部门" prop="responsibleOrgId">
        <el-select
          style="width: 100%"
          v-model="permissionForm.responsibleOrgId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in departList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!-- <el-cascader
          clearable
          filterable
          v-model="permissionForm.responsibleOrgId"
          style="width: 100%"
          :props="departProps"
          :options="departList"
        /> -->
      </el-form-item>
      <el-form-item label="协作部门" prop="collaborateOrgId">
        <el-select
          style="width: 100%"
          multiple
          v-model="permissionForm.collaborateOrgId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="item in departList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!-- <el-cascader
          clearable
          filterable
          v-model="permissionForm.collaborateOrgId"
          style="width: 100%"
          :props="departProps"
          :options="departList"
        /> -->
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
import { configAuthority } from "@/api/task";
export default {
  name: "PermissionDialog",
  props: ["taskId"],
  data() {
    return {
      isBatch: false,
      visible: false,
      permissionForm: {
        collaborateOrgId: [],
      },
      formList: [],
      departList: [],
      loading: false,
      rules: {
        formIds: [{ required: true, message: "请选择表单名称" }],
        collaborateOrgId: [{ required: true, message: "请选协作部门" }],
        responsibleOrgId: [{ required: true, message: "请选负责部门" }],
      },
    };
  },
  methods: {
    close() {
      this.visible = false;
      this.$refs.permissionForm.resetFields();
    },

    handleSubmit() {
      this.$refs.permissionForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let collaborateOrgId = this.permissionForm.collaborateOrgId.join(",");
          let permissionForm = {
            taskId: this.taskId,
            ...this.permissionForm,
            collaborateOrgId,
          };
          configAuthority(permissionForm)
            .then((res) => {
              if (res.state) {
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

    show(isBatch, selectedFormList, formList, departList) {
      this.isBatch = isBatch;
      this.formList = formList;
      this.permissionForm.formIds = selectedFormList.map((form) => form.formId);
      this.departList = departList;
      this.visible = true;
    },
  },
};
</script>

<style></style>
