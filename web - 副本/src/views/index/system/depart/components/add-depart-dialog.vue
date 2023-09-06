<template>
  <el-dialog :visible="visible" title="添加组织" @close="close" width="40%">
    <el-form
      ref="departForm"
      :model="departForm"
      label-width="120px"
      :rules="rules"
      size="small"
      v-loading="loading"
    >
      <el-form-item label="职能类型" prop="type">
        <el-select v-model="departForm.type" style="width: 100%">
          <el-option label="职能部门" value="functional" />
          <el-option label="教学部门" value="teaching" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门名称" prop="name"
        ><el-input v-model="departForm.name"
      /></el-form-item>
      <el-form-item label="部门编码" prop="code"
        ><el-input v-model="departForm.code"
      /></el-form-item>
      <el-form-item label="排序" prop="orderNo"
        ><el-input-number v-model="departForm.orderNo"
      /></el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="departForm.status"
          :active-value="1"
          :inactive-value="0"
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
import { addOrg } from "@/api/system/depart";
export default {
  name: "AddDepartDialog",
  props: ["functionId", "teachingId"],
  data() {
    return {
      visible: false,
      loading: false,
      departForm: {
        parentId: "",
        type: "",
        name: "",
        code: "",
        orderNo: "",
        status: 1,
      },
      rules: {
        type: [{ required: true, message: "请选择职能类型" }],
        name: [{ required: true, message: "组织名称不能为空" }],
        code: [{ required: true, message: "组织编码不能为空" }],
        orderNo: [{ required: true, message: "排序不能为空" }],
      },
    };
  },
  watch: {
    "departForm.type"(newVal) {
      if (newVal == "functional") {
        this.departForm.parentId = this.functionId;
      } else if (newVal == "teaching") {
        this.departForm.parentId = this.teachingId;
      } else {
        this.departForm.parentId = "";
      }
    },
  },
  methods: {
    show() {
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$refs.departForm.resetFields();
      this.departForm = {
        parentId: "",
        type: "",
        name: "",
        code: "",
        orderNo: "",
        status: 1,
      };
    },

    handleSubmit() {
      this.$refs.departForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          addOrg(this.departForm)
            .then((res) => {
              if (res.state) {
                this.$message.success(res.message);
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
  },
};
</script>

<style scoped lang="less"></style>
