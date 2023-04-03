<template>
  <div>
    <el-col
      :md="{ offset: 0, span: 24 }"
      :lg="{ offset: 6, span: 12 }"
      class="form-col"
    >
      <el-form
        ref="dataForm"
        :model="mdl"
        label-width="120px"
        style="max-width: 500px;"
        :label-position="(device !== 'desktop' && 'top') || 'right'"
        size="small"
      >
        <el-form-item label="付款账户：" required>
          <el-select
            v-model="mdl.payAccount"
            placeholder="ant-design@letech.net.cn"
            style="width: 100%;"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款账户：" required>
          <el-input v-model="mdl.revieveAccount.accountName">
            <el-select
              v-model="mdl.revieveAccount.accountType"
              slot="prepend"
              placeholder="请选择"
              style="width: 100px;"
            >
              <el-option label="支付宝" value="支付宝"></el-option>
              <el-option label="微信" value="微信"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="收款人姓名：" required>
          <el-input v-model="mdl.recieveName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="转账金额：" prop="payAmount" required>
          <el-input v-model="mdl.payAmount" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: center;">
        <el-button type="primary" size="small" @click="nextStep"
          >下一步</el-button
        >
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      mdl: {
        revieveAccount: {
          accounttype: '支付宝',
          accountName: 'test@example.com'
        },
        recieveName: 'Alex',
        payAmount: 5000
      },
      select: '',
      options: [
        {
          value: 'ant-design@letech.net.cn',
          label: 'ant-design@letech.net.cn'
        }
      ]
    };
  },
  computed: {
    ...mapState('app', ['device'])
  },
  methods: {
    nextStep() {
      this.$emit('nextStep');
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
