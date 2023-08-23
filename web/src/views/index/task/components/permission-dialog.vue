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
      <el-form-item label="负责部门" prop="responsibleOrg">
        <el-select
          style="width: 100%"
          v-model="permissionForm.responsibleOrg"
          value-key="id"
          placeholder="请选择"
          filterable
          clearable
        >
          <el-option-group
            v-for="group in departList"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item
        label="协作部门"
        prop="collaborateOrg"
        v-if="showCollaborateOrg"
      >
        <el-select
          style="width: 100%"
          v-model="permissionForm.collaborateOrg"
          placeholder="请选择"
          multiple
          filterable
          clearable
          value-key="id"
        >
          <el-option-group
            v-for="group in departList"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <mbutton @click="close" name="取消" />
      <mbutton type="primary" @click="handleSubmit" name="确定" />
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
        formIds: [],
        collaborateOrg: [],
        responsibleOrg: {},
      },
      formList: [],
      departList: [],
      loading: false,
      rules: {
        formIds: [{ required: true, message: "请选择表单名称" }],
        responsibleOrg: [
          {
            validator: (rule, value, callback) => {
              if (Object.keys(value).length == 0) {
                callback(new Error("请选择负责部门"));
              }
              callback();
            },
          },
        ],
        collaborateOrg: [
          {
            validator: (rule, value, callback) => {
              let val = value.find(
                (item) => item == this.permissionForm.responsibleOrg
              );
              if (val != undefined) {
                callback(new Error("负责部门和协作部门不能相同！"));
              }
              callback();
            },
          },
        ],
      },
    };
  },
  computed: {
    showCollaborateOrg() {
      if (!this.isBatch) {
        let form = this.formList.find(
          (form) => form.formId == this.permissionForm.formIds[0]
        );
        if (form && form.formType == "固定表单") {
          return false;
        }
      }
      return true;
    },
  },
  methods: {
    close() {
      this.visible = false;
      this.$refs.permissionForm.resetFields();
    },

    handleSubmit() {
      if (this.isBatch) {
        for (let index in this.permissionForm.formIds) {
          let form = this.formList.find(
            (form) => form.formId == this.permissionForm.formIds[index]
          );
          console.log(this.formList, form);
          if (form && form.formType == "固定表单") {
            this.$message.error(
              `【${form.formName}】为固定表单，无法配置协作部门`
            );
            return;
          }
        }
      }
      this.$refs.permissionForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let responsibleOrgName = this.permissionForm.responsibleOrg.name;
          let responsibleOrgId = this.permissionForm.responsibleOrg.id;
          let collaborateOrgName = this.permissionForm.collaborateOrg
            .map((item) => item.name)
            .join(",");
          let collaborateOrgId = this.permissionForm.collaborateOrg
            .map((item) => item.id)
            .join(",");
          let permissionForm = {
            taskId: this.taskId,
            ...this.permissionForm,
            collaborateOrgId,
            collaborateOrgName,
            responsibleOrgId,
            responsibleOrgName,
          };
          configAuthority(permissionForm)
            .then((res) => {
              if (res.state) {
                this.$emit("refresh");
                this.$message.success(res.message);
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
      this.departList = this.renderDepart(departList);
      this.visible = true;
    },

    renderDepart(departList) {
      let options = [];
      let functionalDepart = departList[0].children.find(
        (depart) => depart.name == "职能部门"
      );
      let teachingDepart = departList[0].children.find(
        (depart) => depart.name == "教学部门"
      );
      options.push({
        label: "职能部门",
        options: functionalDepart.children,
      });
      options.push({
        label: "教学部门",
        options: teachingDepart.children,
      });
      return options;
    },
  },
};
</script>

<style></style>
