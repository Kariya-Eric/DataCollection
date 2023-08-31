<template>
  <el-dialog
    title="配置权限"
    :visible="visible"
    width="35%"
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
      <el-form-item label="表单名称">
        <el-input
          v-model="permissionForm.name"
          disabled
          v-if="!isBatch"
        ></el-input>
        <el-select
          v-else
          style="width: 100%"
          v-model="permissionForm.names"
          multiple
          disabled
        >
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
      <mbutton
        type="primary"
        @click="handleSubmit"
        name="确定"
        :loading="loading"
      />
    </div>
  </el-dialog>
</template>

<script>
import { configAuthority } from "@/api/task";
export default {
  name: "PermissionDialog",
  props: ["taskId", "departs"],
  data() {
    return {
      isBatch: false,
      visible: false,
      permissionForm: {},
      loading: false,
      showCollaborateOrg: false,
      submitFlag: "",
      rules: {
        responsibleOrg: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择负责部门"));
              }
              callback();
            },
          },
        ],
        collaborateOrg: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.length == 0) {
                callback(new Error("请选择负责协作部门"));
              }
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
    departList() {
      let options = [];
      if (this.departs.length > 0) {
        let functionalDepart = this.departs[0].children.find(
          (depart) => depart.name == "职能部门"
        );
        let teachingDepart = this.departs[0].children.find(
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
      }
      return options;
    },
  },

  methods: {
    close() {
      this.visible = false;
      this.$emit("close");
      this.$nextTick(() => this.$refs.permissionForm.resetFields());
    },

    handleSubmit() {
      if (this.submitFlag != "") {
        this.$message.error(
          `【${this.submitFlag}】为固定表单，无法配置协作部门`
        );
        return;
      }
      this.$refs.permissionForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let responsibleOrgName = this.permissionForm.responsibleOrg.name;
          let responsibleOrgId = this.permissionForm.responsibleOrg.id;
          let collaborateOrgName = "";
          let collaborateOrgId = "";
          if (this.permissionForm.collaborateOrg) {
            collaborateOrgName = this.permissionForm.collaborateOrg
              .map((item) => item.name)
              .join(",");
            collaborateOrgId = this.permissionForm.collaborateOrg
              .map((item) => item.id)
              .join(",");
          }
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
                this.$emit("refresh", permissionForm);
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

    edit(records) {
      if (records.length > 1) {
        this.isBatch = true;
        this.showCollaborateOrg = true;
        let forms = records
          .filter((records) => records.formType == "固定表单")
          .map((item) => item.formName)
          .join(",");
        this.submitFlag = forms;
        this.$set(
          this.permissionForm,
          "names",
          records.map((item) => item.formName)
        );
        this.permissionForm.formIds = records.map((item) => item.formId);
      } else {
        this.isBatch = false;
        this.submitFlag = "";
        if (records[0].formType == "固定表单") {
          this.showCollaborateOrg = false;
        } else {
          this.showCollaborateOrg = true;
        }
        this.$set(this.permissionForm, "name", records[0].formName);
        this.permissionForm.formIds = [records[0].formId];
      }
      this.$nextTick(() => this.$refs.permissionForm.clearValidate());
      this.visible = true;
    },
  },
};
</script>

<style></style>
