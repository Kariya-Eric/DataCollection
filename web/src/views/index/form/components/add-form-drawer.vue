<template>
  <el-drawer
    :title="updateFlag ? '表单属性' : '新建表单'"
    :visible="visible"
    @close="close"
  >
    <div class="formDiv">
      <el-form
        v-loading="loading"
        ref="addFormForm"
        :model="addFormForm"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item prop="name" label="所属合集">
          <el-input v-model="addFormForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item prop="type" label="合集类型">
          <el-input v-model="addFormForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item prop="year" label="年份">
          <el-input v-model="addFormForm.year" :disabled="true" />
        </el-form-item>
        <el-form-item prop="formName" label="表单名称">
          <el-input
            v-model="addFormForm.formName"
            placeholder="请输入表单名称"
          />
        </el-form-item>
        <el-form-item prop="formBigType" label="表单大类">
          <el-select
            v-model="addFormForm.formBigType"
            placeholder="请选择表单大类"
            style="width: 100%"
          >
            <el-option label="1.学校基本信息" :value="1" />
            <el-option label="2.学校基本条件" :value="2" />
            <el-option label="3.教师信息" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item prop="formTime" label="统计时间类型">
          <el-select
            v-model="addFormForm.formTime"
            placeholder="请选择统计时间类型"
            style="width: 100%"
          >
            <el-option label="时点" value="时点" />
            <el-option label="学年" value="学年" />
            <el-option label="自然年" value="自然年" />
          </el-select>
        </el-form-item>
        <el-form-item prop="formType" label="表单类型">
          <el-radio v-model="addFormForm.formType" label="1">固定表单</el-radio>
        </el-form-item>
        <el-form-item prop="isNessasary" label="是否必填">
          <el-switch v-model="addFormForm.isNessasary" />
        </el-form-item>
        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="addFormForm.sort" />
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-bottom">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="handleSubmit"
        >提 交</el-button
      >
    </div>
    <form-generator ref="formGenerator" />
  </el-drawer>
</template>

<script>
import FormGenerator from "../form-generator/home";
export default {
  name: "AddFormDrawer",
  components: {
    FormGenerator,
  },
  data() {
    return {
      visible: false,
      updateFlag: false,
      loading: false,
      addFormForm: {},
      rules: {
        name: [{ required: true, message: "请输入合集名称" }],
        type: [{ required: true, message: "请选择合集类型" }],
        year: [{ required: true, message: "请选择年份" }],
        formType: [{ required: true, message: "请选择表单类型" }],
        formName: [{ required: true, message: "请输入表单名称" }],
        formBigType: [{ required: true, message: "请选择表单大类" }],
        formTime: [{ required: true, message: "请选择统计时间类型" }],
        sort: [{ required: true, message: "请输入排序" }],
      },
    };
  },
  methods: {
    show(collection, form) {
      if (form) {
        this.updateFlag = true;
      } else {
        this.updateFlag = false;
      }
      this.addFormForm.name = collection.name;
      this.addFormForm.type = collection.type;
      this.addFormForm.year = collection.year;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },

    handleSubmit() {
      this.$refs.addFormForm.validate((valid) => {
        if (valid) {
          this.$refs.formGenerator.show();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formDiv {
  margin-right: 60px;
  /deep/ .el-form-item {
    margin-bottom: 32px;
  }
}
.drawer-bottom {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 12px 16px 20px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
