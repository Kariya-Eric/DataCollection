<template>
  <el-dialog :title="title" :visible="visible" @close="close" width="30%">
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
    <div slot="footer" class="dialog-footer" v-if="!disableSubmit">
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
import { addRole, updateRole } from "@/api/system";
export default {
  name: "RoleDialog",
  data() {
    return {
      loading: false,
      visible: false,
      title: "",
      name: "角色",
      addFlag: false,
      roleForm: {},
      disableSubmit: false,
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入角色编码", trigger: "blur" }],
      },
    };
  },

  methods: {
    add() {
      this.edit({});
    },

    edit(record) {
      this.roleForm = Object.assign({}, record);
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$nextTick(() => this.$refs.roleForm.resetFields());
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
            this.close();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
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
