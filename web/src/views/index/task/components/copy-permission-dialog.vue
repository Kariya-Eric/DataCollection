<template>
  <el-dialog
    title="复制权限"
    @close="close"
    width="30%"
    :visible="visible"
    :append-to-body="true"
  >
    <el-form
      size="small"
      :model="permissionForm"
      ref="permissionForm"
      label-width="80px"
      :rules="permissionFormRules"
    >
      <el-form-item label="任务名称" prop="sourceId">
        <el-select
          clearable
          v-model="permissionForm.sourceId"
          style="width: 100%"
        >
          <el-option
            v-for="task in taskList"
            :label="task.name"
            :key="task.id"
            :value="task.id"
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
import { taskList, copyAuthority } from "@/api/task";
export default {
  name: "CopyPermissionDialog",
  props: ["taskId"],
  data() {
    return {
      visible: false,
      taskList: [],
      permissionForm: {},
      permissionFormRules: {
        sourceId: [
          { required: true, message: "请选择采集任务，复制该任务的表单权限" },
        ],
      },
    };
  },
  mounted() {
    this.getTaskList();
  },

  methods: {
    getTaskList() {
      let params = {
        pageBean: {
          page: 1,
          pageSize: 2000,
          showTotal: true,
        },
        params: {},
      };
      taskList(params).then((res) => {
        if (res.state) {
          this.taskList = res.value.rows.filter((row) => row.id != this.taskId);
        }
      });
    },
    close() {
      this.visible = false;
      this.$refs.permissionForm.resetFields();
    },
    show() {
      this.visible = true;
    },
    handleSubmit() {
      this.$refs.permissionForm.validate((valid) => {
        if (valid) {
          let param = {
            taskId: this.taskId,
            sourceTaskId: this.permissionForm.sourceId,
          };
          copyAuthority(param).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.$emit("refresh");
              this.close();
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

<style></style>
