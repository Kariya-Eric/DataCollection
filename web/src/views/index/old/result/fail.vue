<template>
  <div class="app-content">
    <el-card shadow="always" class="app-card">
      <result :is-success="false" :title="title" :description="description">
        <template slot="action">
          <el-button type="primary" size="small">返回修改</el-button>
        </template>
        <div>
          <div
            style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 500; margin-bottom: 16px"
          >
            您提交的内容有如下错误：
          </div>
          <div style="margin-bottom: 16px">
            <i
              class="el-icon-circle-close"
              style="color: #f5222d; margin-right: 8px"
            />
            您的账户已被冻结
            <a style="margin-left: 16px"
              >立即解冻 <i class="el-icon-arrow-right"
            /></a>
          </div>
          <div>
            <i
              class="el-icon-circle-close"
              style="color: #f5222d; margin-right: 8px"
            />
            您的账户还不具备申请资格
            <a style="margin-left: 16px"
              >立即升级 <i class="el-icon-arrow-right"
            /></a>
          </div>
        </div>
      </result>
    </el-card>
  </div>
</template>

<script>
import Result from 'components/Result/Result';

export default {
  name: 'Error',
  components: {
    Result
  },
  data() {
    return {
      title: '提交失败',
      description: '请核对并修改以下信息后，再重新提交。'
    };
  }
};
</script>

<style scoped>
</style>
