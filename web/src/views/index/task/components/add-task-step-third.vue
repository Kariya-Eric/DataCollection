<template>
  <div class="main-form" style="overflow: hidden">
    <el-row :gutter="24">
      <el-col :span="6">
        <div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="departFilter"
            clearable
            size="small"
            style="margin-bottom: 12px"
            prefix-icon="el-icon-search"
          >
          </el-input>
          <el-tree
            class="filter-tree"
            :data="departList"
            :props="departProps"
            :filter-node-method="filterNode"
            ref="departTree"
          ></el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="rightSide">
          <div class="header">
            <el-row>
              <span>权限配置状态&nbsp;&nbsp;&nbsp;</span
              ><el-select
                v-model="statusOptions"
                size="small"
                @change="changeStatus"
              >
                <el-option label="全部" :value="0" />
                <el-option label="已配置" :value="1" />
                <el-option label="未配置" :value="2" />
              </el-select>
              <div style="float: right">
                <el-button
                  type="primary"
                  size="small"
                  @click="copyPermission"
                  v-if="selectedRowKeys.length > 0"
                  >复制其他任务权限</el-button
                >
                <el-button
                  type="primary"
                  size="small"
                  @click="applyPermission(true)"
                  v-if="selectedRowKeys.length > 0"
                  >批量配置权限</el-button
                >
              </div>
            </el-row>
          </div>
          <el-table
            :data="configFormList"
            size="small"
            :border="true"
            v-loading="loading"
            @selection-change="onSelectChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="表单名称" align="center" prop="formName" />
            <el-table-column label="权限配置状态" align="center" width="120">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.configStatus" size="small"
                  >已配置</el-tag
                >
                <el-tag v-else size="small">未配置</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              label="负责部门"
              align="center"
              prop="responsibleOrgId"
            />
            <el-table-column
              label="协作部门"
              align="center"
              prop="collaborateOrgId"
            />
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <a
                  href="javascript:;"
                  @click="applyPermission(false, scope.row)"
                  >配置权限</a
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button type="primary" size="small" @click="frontStep"
        >上一步</el-button
      >
      <el-button type="primary" @click="nextStep" size="small"
        >下一步</el-button
      >
      <el-button @click="back" size="small">返回</el-button>
    </div>
    <permission-dialog
      ref="permissionDialog"
      :taskId="taskId"
      @refresh="refresh"
    />
    <copy-permission-dialog ref="copyPermissionDialog" />
  </div>
</template>

<script>
import { initDeptTree } from "@/api/system";
import Vue from "vue";
import { USER_INFO } from "@/store/mutation-types";
import CopyPermissionDialog from "./copy-permission-dialog";
import PermissionDialog from "./permission-dialog";
import { getTask, updateTask, getTaskFormList } from "@/api/task";
export default {
  components: { PermissionDialog, CopyPermissionDialog },
  name: "AddTaskStepThird",
  props: ["taskId"],
  data() {
    return {
      departList: [],
      departFilter: "",
      taskInfo: {},
      departProps: {
        children: "children",
        label: "name",
      },
      statusOptions: 0,
      formList: [],
      configFormList: [],
      loading: false,
      selectedRowKeys: [],
    };
  },
  watch: {
    departFilter(val) {
      this.$refs.departTree.filter(val);
    },
  },
  mounted() {
    this.initDepart();
  },
  watch: {
    taskId: {
      handler(newVal) {
        if (newVal !== undefined) {
          this.loading = true;
          getTask(newVal)
            .then((res) => {
              if (res.state) {
                this.taskInfo = res.value;
                this.getFormList(this.taskInfo.formCollectionId);
              }
            })
            .finally(() => (this.loading = false));
        }
      },
      immediate: true,
    },
  },
  methods: {
    refresh() {
      //TODO 配置完成的回显
      this.selectedRowKeys = [];
      this.getFormList(this.taskInfo.formCollectionId);
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys;
    },
    changeStatus(val) {
      if (val == 0) {
        this.configFormList = this.formList;
      }
      if (val == 1) {
        this.configFormList = this.formList.filter((form) => form.configStatus);
      }
      if (val == 2) {
        this.configFormList = this.formList.filter(
          (form) => !form.configStatus
        );
      }
    },
    initDepart() {
      let userInfo = Vue.ls.get(USER_INFO);
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = res.value;
        }
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    applyPermission(isBatch, row) {
      if (isBatch) {
        this.$refs.permissionDialog.show(
          isBatch,
          this.selectedRowKeys,
          this.formList,
          this.departList
        );
      } else {
        let formList = [];
        formList.push(row);
        this.$refs.permissionDialog.show(
          isBatch,
          formList,
          this.formList,
          this.departList
        );
      }
    },

    getFormList(formCollectionId) {
      this.loading = true;
      let query = {
        taskId: this.taskInfo.id,
        formCollectionId,
      };
      getTaskFormList(query)
        .then((res) => {
          if (res.state) {
            this.formList = res.value;
            this.changeStatus(0);
          }
        })
        .finally(() => (this.loading = false));
    },
    copyPermission() {
      this.$refs.copyPermissionDialog.show();
    },

    frontStep() {
      this.$emit("change", 1);
    },

    nextStep() {
      this.$emit("change", 3);
    },

    back() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 24px;
  .headerButton {
    margin-right: 0px;
  }
}
.main-form {
  width: 70%;
  margin: auto;
}
.rightSide {
  height: 580px;
  padding-left: 24px;
  border-left: 1px solid #e8e8e8;
}

.footer {
  margin-top: 24px;
  text-align: center;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
</style>
