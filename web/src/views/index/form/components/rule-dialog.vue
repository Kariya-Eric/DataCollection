<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @close="close"
    width="40%"
    :append-to-body="true"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="100px"
      size="small"
    >
      <el-form-item label="校验名称">
        <el-input v-model="ruleForm.name" placeholder="请输入检验名称" />
      </el-form-item>
      <el-form-item label="校验模式">
        <el-radio-group v-model="ruleForm.mode">
          <el-radio :label="1">表内校验</el-radio>
          <el-radio :label="2">表间校验</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="校验类型">
        <el-radio-group v-model="ruleForm.type">
          <el-radio :label="1">数据范围校验</el-radio>
          <el-radio :label="2">唯一性校验</el-radio></el-radio>
          <el-radio :label="3">时间日期校验</el-radio>
          <el-radio :label="4">自定义校验</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="校验失败提示">
        <el-input
          type="textarea"
          v-model="ruleForm.msg"
          placeholder="请输入校验失败提示"
        ></el-input>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="ruleForm.enabled"></el-switch>
      </el-form-item>
    </el-form>
    <div v-if="ruleForm.type===1" class="typeDiv"></div>
    <div v-if="ruleForm.type===2" class="typeDiv"></div>
    <div v-if="ruleForm.type===3" class="typeDiv"></div>
    <div v-if="ruleForm.type===4" class="typeDiv"></div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RuleDialog",
  data() {
    return {
      visible: false,
      updateFlag: false,
      ruleForm: {},
      rules: {},
    };
  },
  computed: {
    title() {
      let mode = "";
      if (this.ruleForm.mode === 1) {
        mode = "（表内校验）";
      } else if (this.ruleForm.mode === 2) {
        mode = "（表间校验）";
      }
      return this.updateFlag ? `修改校验${mode}` : `添加校验${mode}`;
    },
  },
  methods: {
    show(info) {
      if (info) {
        this.updateFlag = true;
      } else {
        this.updateFlag = false;
      }
      this.visible = true;
    },

    close() {
      this.ruleForm = {};
      this.visible = false;
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>

<style lang="scss" scoped>
.typeDiv {
  background-color: #f5f8fd;
  height: 200px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
}
</style>