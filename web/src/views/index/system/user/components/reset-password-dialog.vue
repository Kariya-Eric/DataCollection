<template>
  <el-dialog title="重置密码" :visible="visible" @close="close" width="40%">
    <div class="formDiv">
      <el-form
        ref="resetPasswordForm"
        :model="resetPasswordForm"
        label-width="80px"
        size="small"
        :rules="rules"
      >
        <el-form-item prop="password" label="新密码">
          <el-input
            v-model="resetPasswordForm.password"
            clearable
            show-password
          />
        </el-form-item>
        <el-form-item prop="comfirmPwd" label="确认密码">
          <el-input
            v-model="resetPasswordForm.comfirmPwd"
            clearable
            show-password
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ResetPasswordDialog",
  data() {
    return {
      visible: false,
      resetPasswordForm: {},
      rules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        comfirmPwd: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value !== this.resetPasswordForm.password) {
                  callback(new Error("两次密码输入不一致"));
                }
                callback();
              }
              callback(new Error("请再次输入密码"));
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  methods: {
    show() {
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$refs.resetPasswordForm.resetFields();
      this.resetPasswordForm = {};
    },

    handleSubmit() {
      this.$refs.resetPasswordForm.validate((valid) => {
        if (valid) {
          //TODO
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.formDiv {
  margin: 0 24px;
}
</style>