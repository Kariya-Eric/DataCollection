<template>
  <el-dialog :visible="visible" title="添加组织" @close="close" width="40%">
    <el-form
      ref="departForm"
      :model="departForm"
      label-width="120px"
      :rules="rule"
      size="small"
      v-loading="loading"
    >
      <el-form-item label="组织名称" prop="name"
        ><el-input v-model="departForm.name"
      /></el-form-item>
      <el-form-item label="上级组织" prop="parentId">
        <select-tree
          :options="departList"
          :value="departForm.parentId"
          @getValue="getSelectedValue"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="组织编码" prop="code"
        ><el-input v-model="departForm.code"
      /></el-form-item>
      <el-form-item label="排序" prop="orderNo"
        ><el-input-number v-model="departForm.orderNo"
      /></el-form-item>
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
import SelectTree from "components/SelectTree";
import { addOrg } from "@/api/system";
export default {
  name: "AddDepartDialog",
  components: { SelectTree },
  data() {
    return {
      visible: false,
      loading: false,
      departForm: {},
      departList: [],
      rule: {
        name: [{ required: true, message: "组织名称不能为空" }],
        code: [{ required: true, message: "组织编码不能为空" }],
        orderNo: [{ required: true, message: "排序不能为空" }],
        parentId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.departForm.parentId == undefined ||
                this.departForm.parentId == ""
              ) {
                callback(new Error("请选择上级组织"));
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
    show(departList) {
      this.departList = departList;
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$refs.departForm.resetFields();
    },
    getSelectedValue(val) {
      this.departForm.parentId = val;
    },
    handleSubmit() {
      this.$refs.departForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          addOrg(this.departForm).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.$emit("refresh");
              this.close();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
  },
};
</script>

<style></style>
