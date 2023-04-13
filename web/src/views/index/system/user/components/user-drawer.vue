<template>
  <el-drawer
    :title="addFlag ? '新增用户' : updateFlag ? '修改用户' : '查看用户'"
    :visible="visible"
    @close="close"
  >
    <div class="formDiv">
      <el-form
        ref="userForm"
        :model="userForm"
        label-width="120px"
        size="small"
        :rules="rules"
      >
        <el-form-item prop="account" label="帐号">
          <el-input
            :readonly="!addFlag && !updateFlag"
            v-model="userForm.account"
            placeholder="请输入帐号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input
            v-model="userForm.name"
            :readonly="!addFlag && !updateFlag"
            placeholder="请输入姓名"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="addFlag">
          <el-input
            v-model="userForm.password"
            placeholder="请输入密码"
            clearable
            show-password
          />
        </el-form-item>
        <el-form-item prop="comfirmPwd" label="确认密码" v-if="addFlag">
          <el-input
            v-model="userForm.comfirmPwd"
            placeholder="请再次输入密码"
            clearable
            show-password
          />
        </el-form-item>
        <el-form-item prop="orgId" label="所属部门">
          <el-select
            :readonly="!addFlag && !updateFlag"
            v-model="userForm.orgId"
            placeholder="请选择部门"
            clearable
          >
          </el-select>
        </el-form-item>
        <el-form-item prop="role" label="角色">
          <el-select
            v-model="userForm.role"
            placeholder="请选择角色"
            clearable
            :readonly="!addFlag && !updateFlag"
          >
          </el-select>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input
            :readonly="!addFlag && !updateFlag"
            v-model="userForm.email"
            placeholder="请输入邮箱"
            prefix-icon="el-icon-message"
            clearable
          />
        </el-form-item>
        <el-form-item prop="mobile" label="手机">
          <el-input
            :readonly="!addFlag && !updateFlag"
            v-model="userForm.mobile"
            placeholder="请输入手机号"
            prefix-icon="el-icon-mobile"
            maxlength="11"
            clearable
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="userForm.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-bottom" v-if="addFlag || updateFlag">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >提 交</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "UserDrawer",
  data() {
    return {
      addFlag: false,
      updateFlag: false,
      visible: false,
      userForm: {},
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        orgId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        role: [{ required: true, message: "请选择角色", trigger: "blur" }],
        comfirmPwd: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value !== this.userForm.password) {
                  callback(new Error("两次密码输入不一致"));
                }
                callback();
              }
              callback(new Error("请再次输入密码"));
            },
            trigger: ["blur", "change"],
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
                  callback(new Error("清输入正确的手机号"));
                }
                callback();
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    show(addFlag, updateFlag, info) {
      this.visible = true;
      if (info) {
        //TODO建议发个请求
        this.userForm = JSON.parse(JSON.stringify(info));
      }
      this.addFlag = addFlag;
      this.updateFlag = updateFlag;
    },

    close() {
      this.visible = false;
      this.$refs.userForm.resetFields();
      this.userForm = {};
    },

    handleSubmit() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          if (this.addFlag) {
            this.handleAdd();
          } else {
            this.handleUpdate();
          }
        }
      });
    },

    handleAdd() {
      console.log("add", this.userForm);
    },
    handleUpdate() {
      console.log("update", this.userForm);
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