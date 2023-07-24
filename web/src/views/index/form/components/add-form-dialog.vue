<template>
  <el-dialog
    :title="updateFlag ? '表单属性' : '新建表单'"
    :visible="visible"
    width="40%"
    @close="close"
  >
    <el-form
      v-loading="loading"
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
        <el-input
          v-model="addFormForm.formName"
          placeholder="请输入表单名称"
          :disabled="updateFlag && addFormForm.enabledFlag == 1"
        />
      </el-form-item>
      <el-form-item prop="formCategories" label="表单大类">
        <el-select
          :disabled="
            formCategoryList.length == 0 ||
            (updateFlag && addFormForm.enabledFlag == 1)
          "
          v-model="addFormForm.formCategories"
          placeholder="请选择表单大类"
          style="width: 100%"
        >
          <el-option
            v-for="item in formCategoryList"
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
          :disabled="updateFlag && addFormForm.enabledFlag == 1"
        >
          <el-option label="时点" value="时点" />
          <el-option label="学年" value="学年" />
          <el-option label="自然年" value="自然年" />
        </el-select>
      </el-form-item>
      <el-form-item prop="formType" label="表单类型">
        <el-radio-group v-model="addFormForm.formType" :disabled="updateFlag">
          <el-radio label="浮动表单"></el-radio>
          <el-radio label="固定表单"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="sort" label="排序" v-if="updateFlag">
        <el-input-number
          v-model="addFormForm.sort"
          :precision="0"
          :min="0"
          :disabled="addFormForm.enabledFlag == 1"
        />
      </el-form-item>
      <el-form-item label="是否必填">
        <el-switch
          v-model="addFormForm.required"
          :disabled="updateFlag && addFormForm.enabledFlag == 1"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="handleSubmit"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { listFormCategories, addForm, updateForm } from "@/api/form";

export default {
  name: "AddFormDialog",
  data() {
    return {
      visible: false,
      updateFlag: false,
      loading: false,
      addFormForm: {},
      formCategoryList: [],
      rules: {
        name: [{ required: true, message: "请输入合集名称" }],
        type: [{ required: true, message: "请选择合集类型" }],
        year: [{ required: true, message: "请选择年份" }],
        formType: [{ required: true, message: "请选择表单类型" }],
        formName: [{ required: true, message: "请输入表单名称" }],
        formCategories: [{ required: true, message: "请选择表单大类" }],
        collectTimeType: [{ required: true, message: "请选择统计时间类型" }],
        sort: [{ required: true, message: "排序字段不能为空" }],
      },
    };
  },
  methods: {
    show(collection, form) {
      if (form) {
        this.updateFlag = true;
        const {
          type,
          name,
          sort,
          required,
          collectTimeType,
          formCategories,
          id,
        } = form;
        this.addFormForm = {
          id,
          formName: name,
          sort,
          formType: type,
          collectTimeType,
          required,
          formCategories,
        };
      } else {
        this.updateFlag = false;
        this.$set(this.addFormForm, "required", true);
      }
      this.addFormForm.formCollectionId = collection.id;
      this.addFormForm.name = collection.name;
      this.addFormForm.type = collection.type;
      this.addFormForm.year = collection.year;
      this.addFormForm.enabledFlag = collection.enabledFlag;
      listFormCategories(collection.id).then((res) => {
        if (res.state) {
          this.formCategoryList = res.value
            .sort((a, b) => a.sort - b.sort)
            .map((val) => {
              val.name = val.sort + 1 + "、" + val.name;
              return val;
            });
        }
      });
      this.visible = true;
    },

    close() {
      this.$refs.addFormForm.resetFields();
      this.visible = false;
    },

    handleSubmit() {
      this.$refs.addFormForm.validate((valid) => {
        if (valid) {
          if (this.updateFlag) {
            this.updateForm();
          } else {
            this.addForm();
          }
        }
      });
    },

    updateForm() {
      const { collectTimeType, formCategories, sort, formCollectionId } =
        this.addFormForm;
      let params = {
        id: this.addFormForm.id,
        name: this.addFormForm.formName,
        type: this.addFormForm.formType,
        required: this.addFormForm.required ? this.addFormForm.required : false,
        formCollectionId,
        collectTimeType,
        formCategories,
        sort,
        rowNum: 10,
        cellNum: 4,
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
      const { collectTimeType, formCategories, formCollectionId } =
        this.addFormForm;
      let params = {
        name: this.addFormForm.formName,
        type: this.addFormForm.formType,
        required: this.addFormForm.required ? this.addFormForm.required : false,
        formCollectionId,
        collectTimeType,
        formCategories,
        rowNum: 10,
        cellNum: 4,
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
