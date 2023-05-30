<template>
  <el-dialog
    :title="updateFlag ? '合集属性' : '新建合集'"
    :visible="visible"
    @close="close"
    width="35%"
  >
    <div class="formDiv">
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
            :disabled="updateFlag"
          />
        </el-form-item>
        <el-form-item prop="type" label="合集类型">
          <el-select
            v-model="addCollectionForm.type"
            placeholder="请选择合集类型"
            style="width: 100%"
            :disabled="updateFlag"
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
          />
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input-number
            v-model="addCollectionForm.sort"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addFormCollection, updateFormCollection } from "@/api/form";
export default {
  data() {
    return {
      loading: false,
      updateFlag: false,
      visible: false,
      addCollectionForm: {},
      rules: {
        name: [{ required: true, message: "请输入合集名称" }],
        type: [{ required: true, message: "请选择合集类型" }],
        year: [{ required: true, message: "请选择年份" }],
        sort: [{ required: true, message: "请输入排序" }],
      },
    };
  },
  methods: {
    show(data) {
      if (data) {
        this.addCollectionForm = JSON.parse(JSON.stringify(data));
        this.updateFlag = true;
      } else {
        this.updateFlag = false;
      }
      this.visible = true;
    },
    close() {
      this.visible = false;
      this.$refs.addCollectionForm.resetFields();
      this.addCollectionForm = {};
    },
    handleSubmit() {
      this.$refs.addCollectionForm.validate((valid) => {
        if (valid) {
          if (this.updateFlag) {
            this.handleUpdate();
          } else {
            this.handleAdd();
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
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.close();
          this.loading = false;
        });
    },

    handleUpdate() {
      updateFormCollection(this.addCollectionForm)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.close();
          this.loading = false;
        });
    },
  },
};
</script>

<style>
</style>