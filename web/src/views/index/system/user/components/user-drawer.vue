<template>
  <el-drawer
    :visible="visible"
    @close="close"
    :show-close="false"
    v-if="visible"
  >
    <div slot="title" class="titleSlot">
      <span>{{
        addFlag ? "新增用户" : updateFlag ? "修改用户" : "查看用户"
      }}</span>
      <div class="titleButton">
        <mbutton name="返回" icon="返回" @click="close" />
      </div>
    </div>
    <el-form
      ref="userForm"
      :model="userForm"
      label-width="100px"
      size="small"
      :rules="rules"
      v-loading="loading"
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
        <select-tree
          :options="departList"
          :readonly="!addFlag && !updateFlag"
          placeholder="请选择部门"
          :value="userForm.orgId"
          @getValue="getSelectedValue"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item prop="roleIds" label="角色">
        <el-select
          v-model="userForm.roleIds"
          placeholder="请选择角色"
          clearable
          style="width: 100%"
          multiple=""
          :readonly="!addFlag && !updateFlag"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
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
    <div class="drawer-bottom" v-if="addFlag || updateFlag">
      <mbutton @click="close" name="取消" />
      <mbutton type="primary" name="提交" @click="handleSubmit" />
    </div>
  </el-drawer>
</template>

<script>
import Vue from "vue";
import { USER_INFO } from "@/store/mutation-types";
import { addUser, updateUser, initDeptTree, getRoleList } from "@/api/system";
export default {
  name: "UserDrawer",
  data() {
    return {
      addFlag: false,
      updateFlag: false,
      visible: false,
      loading: false,
      userForm: {
        account: "",
        name: "",
        password: "",
        orgId: "",
        roleIds: [],
        comfirmPwd: "",
        email: "",
        mobile: "",
      },
      roleList: [],
      departList: [],
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "密码长度不小于6位", trigger: "blur" },
        ],
        orgId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.userForm.orgId == undefined ||
                this.userForm.orgId == ""
              ) {
                callback(new Error("请选择部门"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
        roleIds: [
          { required: true, message: "请至少选择一个角色", trigger: "blur" },
        ],
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
    initDepart() {
      let userInfo = Vue.ls.get(USER_INFO);
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = res.value;
          this.initRole();
        }
      });
    },
    initRole() {
      getRoleList({}).then((res) => {
        if (res.state) {
          this.roleList = res.value.rows;
        }
      });
    },

    getSelectedValue(val) {
      this.userForm.orgId = val;
    },

    show(addFlag, updateFlag, info) {
      this.visible = true;
      if (info) {
        this.userForm = JSON.parse(JSON.stringify(info));
      }
      this.initDepart();
      this.addFlag = addFlag;
      this.updateFlag = updateFlag;
    },

    close() {
      this.visible = false;
      this.$refs.userForm.resetFields();
      this.roleList = [];
      this.userForm = {
        account: "",
        name: "",
        password: "",
        orgId: "",
        roleIds: [],
        comfirmPwd: "",
        email: "",
        mobile: "",
      };
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
      this.loading = true;
      addUser(this.userForm)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
        .finally(() => this.close());
    },
    handleUpdate() {
      this.loading = true;
      updateUser(this.userForm)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
          } else {
            this.$message.error(res.message);
          }
          this.loading = false;
        })
        .finally(() => this.close());
    },
  },
};
</script>

<style lang="scss" scoped>
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
