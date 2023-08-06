<template>
  <el-dialog
    :title="addFlag ? '新增角色' : '修改角色'"
    :visible="visible"
    @close="close"
    v-if="visible"
    width="30%"
  >
    <div class="formDiv">
      <el-form
        ref="roleForm"
        :model="roleForm"
        label-width="80px"
        size="small"
        :rules="rules"
        v-loading="loading"
      >
        <el-form-item prop="code" label="角色编码">
          <el-input v-model="roleForm.code" clearable :disabled="!addFlag" />
        </el-form-item>
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" clearable />
        </el-form-item>
        <el-form-item prop="enabled" label="状态">
          <el-switch
            v-model="roleForm.enabled"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <Mbutton @click="close" name="取消" />
      <Mbutton type="primary" @click="handleSubmit" name="确定" />
    </div>
  </el-dialog>
</template>

<script>
import { addRole, updateRole } from "@/api/system";
export default {
  name: "RoleDialog",
  data() {
    return {
      loading: false,
      visible: false,
      roleForm: {
        code: "",
        name: "",
        enabled: 0,
      },
      addFlag: false,
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
      },
    };
  },

  methods: {
    show(addFlag, info) {
      this.visible = true;
      if (info) {
        const { enabled, code, name } = JSON.parse(JSON.stringify(info));
        this.roleForm = { enabled, code, name };
      }
      this.addFlag = addFlag;
    },

    close() {
      this.visible = false;
      this.$refs.roleForm.resetFields();
      this.roleForm = {
        code: "",
        name: "",
        enabled: 0,
      };
    },

    handleSubmit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          if (this.addFlag) {
            this.handleAdd();
          } else {
            this.handleUpdate();
          }
        }
      });
    },

    handleAdd() {
      this.loading = true;
      addRole(this.roleForm)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
          this.close();
        });
    },

    handleUpdate() {
      this.loading = true;
      updateRole(this.roleForm)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
          this.close();
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.formDiv {
  margin: 0 24px;
}
</style>
