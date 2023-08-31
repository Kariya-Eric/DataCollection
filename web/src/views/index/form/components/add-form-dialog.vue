<template>
  <el-dialog
    :title="title"
    :visible="visible"
    width="40%"
    @close="close"
    v-loading="true"
  >
    <el-form
      ref="addFormForm"
      :model="addFormForm"
      label-width="120px"
      size="small"
      :rules="rules"
    >
      <el-form-item prop="name" label="所属合集">
        <el-input v-model="addFormForm.name" disabled />
      </el-form-item>
      <el-form-item prop="type" label="合集类型">
        <el-input v-model="addFormForm.type" disabled />
      </el-form-item>
      <el-form-item prop="year" label="年份">
        <el-input v-model="addFormForm.year" disabled />
      </el-form-item>
      <el-form-item prop="formName" label="表单名称">
        <el-input v-model="addFormForm.formName" placeholder="请输入表单名称" />
      </el-form-item>
      <el-form-item prop="formCategories" label="表单大类">
        <el-select
          v-model="addFormForm.formCategories"
          placeholder="请选择表单大类"
          style="width: 100%"
        >
          <el-option
            v-for="item in categorys"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="collectTimeType" label="统计时间类型">
        <el-select
          v-model="addFormForm.collectTimeType"
          placeholder="请选择统计时间类型"
          style="width: 100%"
        >
          <el-option label="时点" value="时点" />
          <el-option label="学年" value="学年" />
          <el-option label="自然年" value="自然年" />
        </el-select>
      </el-form-item>
      <el-form-item prop="formType" label="表单类型">
        <el-radio-group v-model="addFormForm.formType">
          <el-radio label="浮动表单"></el-radio>
          <el-radio label="固定表单"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="sort" label="排序">
        <el-input-number v-model="addFormForm.sort" :precision="0" :min="0" />
      </el-form-item>
      <el-form-item label="是否必填">
        <el-switch v-model="addFormForm.required" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" v-if="!disableSubmit">
      <mbutton name="取消" @click="close" />
      <mbutton
        type="primary"
        name="提交"
        @click="handleSubmit"
        :loading="loading"
      />
    </div>
  </el-dialog>
</template>

<script>
import { addForm, updateForm } from "@/api/form";

export default {
  name: "AddFormDialog",
  props: ["collection", "categorys"],
  data() {
    return {
      visible: false,
      disableSubmit: false,
      addFlag: false,
      loading: false,
      addFormForm: {},
      title: "",
      name: "表单",
      rules: {
        formType: [{ required: true, message: "请选择表单类型" }],
        formName: [{ required: true, message: "请输入表单名称" }],
        collectTimeType: [{ required: true, message: "请选择统计时间类型" }],
        sort: [{ required: true, message: "排序字段不能为空" }],
      },
    };
  },
  methods: {
    add() {
      this.edit({});
      this.$nextTick(() => this.$refs.addFormForm.clearValidate());
    },

    edit(record) {
      let collection = {
        ...this.collection,
        formCollectionId: this.collection.id,
      };
      if (record.id) {
        let form = { ...record, formName: record.name, formType: record.type };
        this.addFormForm = Object.assign({}, collection, form);
      } else {
        this.addFormForm = collection;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$nextTick(() => this.$refs.addFormForm.resetFields());
    },

    handleSubmit() {
      this.$refs.addFormForm.validate((valid) => {
        if (valid) {
          if (this.addFlag) {
            this.addForm();
          } else {
            this.updateForm();
          }
        }
      });
    },

    updateForm() {
      let params = {
        ...this.addFormForm,
        name: this.addFormForm.formName,
        type: this.addFormForm.formType,
        required: this.addFormForm.required ? this.addFormForm.required : false,
      };
      this.loading = true;
      updateForm(params)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
            this.close();
          } else {
            this.$message.error(res.value);
          }
        })
        .finally(() => (this.loading = false));
    },

    addForm() {
      let params = {
        ...this.addFormForm,
        name: this.addFormForm.formName,
        type: this.addFormForm.formType,
      };
      this.loading = true;
      addForm(params)
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
    },
  },
};
</script>

<style lang="scss" scoped></style>
