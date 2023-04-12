<template>
  <div>
    <el-col
      :md="{ offset: 0, span: 24 }"
      :lg="{ offset: 6, span: 12 }"
      class="form-col"
    >
      <el-alert
        title="确认转账后，资金将直接打入对方账户，无法退回。"
        type="success"
        style="margin-bottom: 10px; width: 500px;"
      >
      </el-alert>
      <el-form
        ref="dataForm"
        :model="mdl"
        label-width="120px"
        style="max-width: 500px;"
        label-position="right"
        size="small"
      >
        <el-form-item label="付款账户：" required>
          <span>ant-design@alipay.com</span>
        </el-form-item>
        <el-form-item label="收款账户：" required>
          <span>test@example.com</span>
        </el-form-item>
        <el-form-item label="收款人姓名：" required>
          <span>Alex</span>
        </el-form-item>
        <el-form-item label="转账金额：" required>
          <span>5000</span>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="支付密码：" required>
          <el-input
            show-password
            v-model="mdl.payPassword"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: center;">
        <el-button
          type="primary"
          size="small"
          @click="nextStep"
          :loading="isLoading"
          >提交</el-button
        ><el-button size="small" @click="prevStep">上一步</el-button>
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mdl: { payPassword: '123456' },
      isLoading: false
    };
  },
  methods: {
    nextStep() {
      const that = this;
      that.isLoading = true;
      setTimeout(function() {
        that.$emit('nextStep');
      }, 1500);
    },
    prevStep() {
      this.$emit('prevStep');
    }
  }
};
</script>

<style lang="scss" scoped>
.form-col {
  padding: 0 0 50px 50px;
}

.mobile {
  .form-col {
    padding: 0 0 50px 0;
  }
}
</style>
