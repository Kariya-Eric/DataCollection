<template>
  <el-dialog
    title="配置人员"
    @close="close"
    width="30%"
    :visible="visible"
    :append-to-body="true"
    v-if="visible"
  >
    <el-form
      size="small"
      :model="configForm"
      ref="configForm"
      label-width="80px"
      :rules="configFormRules"
    >
      <el-form-item v-show="false">
        <el-input v-model="configForm.responsibleUserName" />
      </el-form-item>
      <el-form-item v-show="false">
        <el-input v-model="configForm.fillUserName" />
      </el-form-item>
      <el-form-item label="表单名称">
        <el-input disabled v-model="configForm.formName" />
      </el-form-item>
      <el-form-item label="填报人" prop="fillUser">
        <el-select v-model="configForm.fillUser" style="width: 100%">
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核人" prop="responsibleUser">
        <el-select v-model="configForm.responsibleUser" style="width: 100%">
          <el-option
            v-for="user in userList"
            :key="user.id"
            :label="user.name"
            :value="user.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { getUserList } from "@/api/system";
import { configAuthUser } from "@/api/task";
export default {
  data() {
    return {
      visible: false,
      configForm: {
        formName: "",
        fillUser: "",
        responsibleUser: "",
        responsibleUserName: "",
        fillUserName: "",
      },
      userList: [],
      configFormRules: {
        fillUser: [{ required: true, message: "请选择填报人" }],
        responsibleUser: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value == this.configForm.fillUser) {
                  callback(new Error("审核人和填报人不能相同"));
                }
                callback();
              }
              callback(new Error("请选择审核人"));
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },

  watch: {
    "configForm.responsibleUser"(newVal) {
      if (newVal != "") {
        this.configForm.responsibleUserName = this.userList.find(
          (item) => item.id == newVal
        ).name;
      }
    },
    "configForm.fillUser"(newVal) {
      if (newVal != "") {
        this.configForm.fillUserName = this.userList.find(
          (item) => item.id == newVal
        ).name;
      }
    },
  },
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      getUserList({}).then((res) => {
        if (res.state) {
          this.userList = res.value.rows;
        }
      });
    },

    close() {
      this.visible = false;
      this.$refs.configForm.resetFields();
      this.configForm = {
        formName: "",
        fillUser: "",
        responsibleUser: "",
        responsibleUserName: "",
        fillUserName: "",
      };
    },
    show(info) {
      this.configForm.id = info.id;
      this.configForm.formName = info.formName;
      this.visible = true;
    },

    handleSubmit() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          configAuthUser(this.configForm).then((res) => {
            if (res.state) {
              this.close();
              this.$message.success(res.message);
              this.$emit("refresh");
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
