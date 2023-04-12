<template>
  <div>
    <!-- header -->
    <div>
      <h3 style="font-weight: 500;">基本设置</h3>
    </div>
    <!-- form -->
    <el-form
      ref="dataForm"
      style="max-width: 800px; padding: 20px 30px;"
      label-position="top"
      size="small"
    >
      <el-form-item label="姓名">
        <el-input placeholder="请输入" />
      </el-form-item>
      <el-form-item label="电话">
        <el-input placeholder="请输入" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input placeholder="请输入" type="textarea" />
      </el-form-item>

      <div style="padding: 30px 0; display: flex; justify-content: center;">
        <el-button type="primary" size="small">保存</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'BasicSetting'
};
</script>
