<template>
  <el-dialog :title="title" :visible="visible" @close="close" width="25%">
    <el-form
      ref="addCollectionForm"
      :model="addCollectionForm"
      label-width="80px"
      size="small"
      :rules="rules"
      v-loading="loading"
    >
      <el-form-item prop="name" label="合集名称">
        <el-input
          v-model="addCollectionForm.name"
          clearable
          placeholder="请输入合集名称"
          style="width: 100%"
          :disabled="addCollectionForm.enabledFlag == 1"
        />
      </el-form-item>
      <el-form-item prop="type" label="合集类型">
        <el-select
          v-model="addCollectionForm.type"
          placeholder="请选择合集类型"
          style="width: 100%"
          :disabled="addCollectionForm.enabledFlag == 1"
        >
          <el-option
            label="教学基本状态数据"
            value="教学基本状态数据"
          ></el-option>
          <el-option label="其他数据" value="其他数据"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="year" label="年份">
        <el-date-picker
          v-model="addCollectionForm.year"
          value-format="yyyy"
          type="year"
          format="yyyy"
          placeholder="请选择年份"
          style="width: 100%"
          :disabled="addCollectionForm.enabledFlag == 1"
        />
      </el-form-item>
    </el-form>

    <div slot="footer" v-if="!disableSubmit">
      <mbutton name="取消" @click="close" />
      <mbutton
        type="primary"
        name="确定"
        @click="handleSubmit"
        :loading="loading"
      />
    </div>
  </el-dialog>
</template>

<script>
import { addFormCollection, updateFormCollection } from "@/api/form";
export default {
  data() {
    return {
      loading: false,
      addFlag: false,
      addCollectionForm: {},
      visible: false,
      disableSubmit: false,
      title: "",
      name: "合集",
      rules: {
        name: [{ required: true, message: "请输入合集名称" }],
        type: [{ required: true, message: "请选择合集类型" }],
        year: [{ required: true, message: "请选择年份" }],
      },
    };
  },
  methods: {
    add() {
      this.edit({});
    },

    edit(record) {
      this.addCollectionForm = Object.assign({}, record);
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$nextTick(() => this.$refs.addCollectionForm.resetFields());
    },

    handleSubmit() {
      this.$refs.addCollectionForm.validate((valid) => {
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
      addFormCollection(this.addCollectionForm)
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
      updateFormCollection(this.addCollectionForm)
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
  },
};
</script>

<style></style>
