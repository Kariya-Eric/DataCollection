<template>
  <div>
    <el-dialog
      title="添加已有用户"
      :visible="visible"
      @close="close"
      width="40%"
    >
      <div class="filter-container">
        <el-form label-width="90px" size="small" :inline="true">
          <el-form-item label="用户账号">
            <el-input placeholder="请输入账号查询" clearable />
          </el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search"
            >搜索</el-button
          >
          <el-button type="primary" size="small" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ExistUserDialog",
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    handleSubmit() {},
  },
};
</script>

<style scoped lang="less"></style>
