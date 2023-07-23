<template>
  <el-dialog
    title="配置人员"
    @close="close"
    width="30%"
    :visible="visible"
    :append-to-body="true"
  >
    <el-form
      size="small"
      :model="configForm"
      ref="configForm"
      label-width="80px"
      :rules="configFormRules"
    >
      <el-form-item label="表单名称" prop="formName">
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
import{ configAuthUser} from '@/api/task'
export default {
  data() {
    return {
      visible: false,
      configForm: {},
      taskId: "",
      userList: [],
      configFormRules: {
        formName: [{ required: true, message: "表单名称不能为空" }],
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
  mounted() {
    this.getUser();
  },
  methods: {
    getUser() {
      let param = {
        pageBean: {
          page: 1,
          pageSize: 2000,
          showTotal: true,
        },
        params: {},
      };
      getUserList(param).then((res) => {
        if (res.state) {
          this.userList = res.value.rows;
        }
      });
    },

    close() {
      this.visible = false;
      this.$refs.configForm.resetFields();
    },
    show(info, taskId) {
      this.configForm.formId = info.formId;
      this.configForm.formName = info.formName;
      this.taskId = taskId;
      this.visible = true;
    },

    handleSubmit() {
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          let fillUserName = this.userList.filter(
            (user) => user.id == this.configForm.fillUser
          )[0].name;
          let responsibleUserName = this.userList.filter(
            (user) => user.id == this.configForm.responsibleUser
          )[0].name;
          const { formId, fillUser, responsibleUser } = this.configForm;
          let param = {
            formId,
            fillUser,
            responsibleUser,
            fillUserName,
            responsibleUserName,
            taskId: this.taskId,
          };
          configAuthUser(param).then((res) => {
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
