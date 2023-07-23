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
        <select-tree
          :options="departList"
          :value="permissionForm.responsibleOrgId"
          placeholder="请选择"
          @getValue="getOrgValue"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="协作部门" prop="collaborateOrgId">
        <select-tree
          :options="departList"
          :valueMultiple="permissionForm.collaborateOrgId"
          multiple
          placeholder="请选择"
          @getValue="getAssistValue"
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
import { configAuthority } from "@/api/task";
import SelectTree from "components/SelectTree";
export default {
  name: "PermissionDialog",
  props: ["taskId"],
  components: { SelectTree },
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
        collaborateOrgId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.permissionForm.collaborateOrgId == undefined ||
                this.permissionForm.collaborateOrgId.length == 0
              ) {
                callback(new Error("请选协助部门"));
              }
              let flag = true;
              for (
                let i = 0;
                i < this.permissionForm.collaborateOrgId.length;
                i++
              ) {
                if (
                  this.permissionForm.collaborateOrgId[i].id ==
                  this.permissionForm.responsibleOrgId
                ) {
                  flag = false;
                  break;
                }
              }
              if (!flag) {
                callback(new Error("协作部门和负责部门不能为同一个"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
        responsibleOrgId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.permissionForm.responsibleOrgId == undefined ||
                this.permissionForm.responsibleOrgId == ""
              ) {
                callback(new Error("请选负责部门"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
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

          let collaborateOrgId = this.permissionForm.collaborateOrgId
            .map((item) => item.id)
            .join(",");
          let collaborateOrgName = this.permissionForm.collaborateOrgId
            .map((item) => item.name)
            .join(",");
          let responsibleOrgName = this.renderList(this.departList).filter(
            (depart) => depart.id == this.permissionForm.responsibleOrgId
          )[0].name;
          let permissionForm = {
            taskId: this.taskId,
            ...this.permissionForm,
            collaborateOrgId,
            collaborateOrgName,
            responsibleOrgId: this.permissionForm.responsibleOrgId,
            responsibleOrgName,
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

    renderList(list) {
      let options = [];
      this.recusive(list, options);
      return options;
    },

    recusive(list, options) {
      list.forEach((item) => {
        options.push({ name: item.name, id: item.id });
        if (item.children && item.children.length > 0) {
          this.recusive(item.children, options);
        }
      });
    },

    getOrgValue(val) {
      this.permissionForm.responsibleOrgId = val;
    },
    getAssistValue(val) {
      this.permissionForm.collaborateOrgId = val;
    },
  },
};
</script>

<style></style>
