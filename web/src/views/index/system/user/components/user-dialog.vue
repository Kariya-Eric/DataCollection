<template>
  <el-dialog
    width="35%"
    :visible="visible"
    @close="close"
    :title="addFlag ? '新增用户' : updateFlag ? '修改用户' : '查看用户'"
    v-if="visible"
  >
    <el-form
      ref="userForm"
      :model="userForm"
      label-width="80px"
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
      <el-form-item prop="orgId" label="所属部门">
        <el-select
          :readonly="!addFlag && !updateFlag"
          style="width: 100%"
          v-model="userForm.orgId"
          placeholder="请选择"
          filterable
          :disabled="orgId != ''"
          clearable
        >
          <el-option-group
            v-for="group in departList"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-option-group>
        </el-select>
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
    <div slot="footer" class="dialog-footer" v-if="addFlag || updateFlag">
      <mbutton @click="close" name="取消" />
      <mbutton type="primary" name="提交" @click="handleSubmit" />
    </div>
  </el-dialog>
</template>

<script>
import { USER_INFO } from "@/store/mutation-types";
import { addUser, updateUser, initDeptTree, getRoleList } from "@/api/system";
import { getUserDetail } from "@/api/system/user";
export default {
  name: "UserDrawer",
  props: {
    orgId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      addFlag: false,
      updateFlag: false,
      visible: false,
      loading: false,
      userForm: {
        account: "",
        name: "",
        orgId: "",
        roleIds: [],
        email: "",
        mobile: "",
        status: 1,
      },
      roleList: [],
      departList: [],
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
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
    renderDepart(departList) {
      let options = [];
      let functionalDepart = departList[0].children.find(
        (depart) => depart.name == "职能部门"
      );
      let teachingDepart = departList[0].children.find(
        (depart) => depart.name == "教学部门"
      );
      options.push({
        label: "职能部门",
        options: functionalDepart.children,
      });
      options.push({
        label: "教学部门",
        options: teachingDepart.children,
      });
      return options;
    },

    initDepart() {
      let userInfo = this.$ls.get(USER_INFO);
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = this.renderDepart(res.value);
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

    show(addFlag, updateFlag, info) {
      if (info) {
        this.loading = true;
        getUserDetail(info.id)
          .then((res) => {
            if (res.state) {
              this.userForm = res.value;
            }
          })
          .finally(() => (this.loading = false));
      }
      this.initDepart();
      this.addFlag = addFlag;
      this.updateFlag = updateFlag;
      if (this.orgId != "") {
        this.userForm.orgId = this.orgId;
      }
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.$refs.userForm.resetFields();
      this.roleList = [];
      this.userForm = {
        account: "",
        name: "",
        orgId: "",
        roleIds: [],
        email: "",
        mobile: "",
        status: 1,
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
      let param = { ...this.userForm, password: "123456" };
      addUser(param)
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

<style lang="scss" scoped></style>
