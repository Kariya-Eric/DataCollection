<template>
  <div>
    <el-col
      :md="{ offset: 0, span: 24 }"
      :lg="{ offset: 6, span: 12 }"
      class="form-col"
    >
      <el-form
        label-width="120px"
        style="max-width: 1000px;"
        label-position="right"
        size="small"
      >
        <result
          title="操作成功"
          :is-success="true"
          description="预计两小时内到账"
        >
          <div class="information">
            <el-row>
              <el-col :sm="8" :xs="24">付款账户：</el-col>
              <el-col :sm="16" :xs="24">ant-design@alipay.com</el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :xs="24">收款账户：</el-col>
              <el-col :sm="16" :xs="24">test@example.com</el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :xs="24">收款人姓名：</el-col>
              <el-col :sm="16" :xs="24">辉夜</el-col>
            </el-row>
            <el-row>
              <el-col :sm="8" :xs="24">转账金额：</el-col>
              <el-col :sm="16" :xs="24"
                ><span class="money">500</span> 元</el-col
              >
            </el-row>
          </div>
          <div slot="action">
            <el-button type="primary" @click="finish" size="small"
              >再转一笔</el-button
            >
            <el-button
              style="margin-left: 8px"
              @click="toOrderList"
              size="small"
              >查看账单</el-button
            >
          </div>
        </result>
      </el-form>
      <!-- <div style="display: flex; justify-content: center;">
        <el-button type="primary" size="small" @click="finish"
          >再转一笔</el-button
        ><el-button size="small" @click="toOrderList">查看账单</el-button>
      </div> -->
    </el-col>
  </div>
</template>

<script>
import Result from '@/components/Result/Result';
export default {
  components: {
    Result
  },
  data() {
    return {
      mdl: {}
    };
  },
  methods: {
    finish() {
      this.$emit('finish');
    },
    toOrderList() {
      // this.$router.push('/list/query-list');
    }
  }
};
</script>

<style lang="scss" scoped>
.information {
  line-height: 22px;

  .el-row:not(:last-child) {
    margin-bottom: 24px;
  }
}
.money {
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
}

.form-col {
  padding: 0 0 50px 50px;
}

.mobile {
  .form-col {
    padding: 0 0 50px 0;
  }
}
</style>
