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
            default-expand-all
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
                <mbutton
                  type="primary"
                  name="复制其他任务权限"
                  @click="copyPermission"
                />
                <mbutton
                  type="primary"
                  name="批量配置权限"
                  @click="applyPermissionBatch"
                />
              </div>
            </el-row>
          </div>
          <el-table
            :data="configFormList"
            ref="table"
            class="listTable"
            :header-cell-style="headerStyle"
            v-loading="loading"
            @selection-change="onSelectChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="表单名称" align="center" prop="formName">
              <template slot-scope="scope">
                <svg-icon
                  icon-class="固定表单"
                  width="16px"
                  height="16px"
                  v-if="scope.row.formType == '固定表单'"
                />
                <svg-icon
                  icon-class="浮动表单"
                  width="16px"
                  height="16px"
                  v-else
                />
                <span style="margin-left: 10px">{{ scope.row.formName }}</span>
              </template>
            </el-table-column>
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
              prop="responsibleOrgName"
            />
            <el-table-column
              label="协作部门"
              align="center"
              prop="collaborateOrgName"
            />
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <menu-link no-divider @click="applyPermission(scope.row)"
                  >配置权限</menu-link
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <mbutton type="primary" name="上一步" @click="frontStep" />
      <mbutton type="primary" @click="nextStep" name="下一步" />
      <mbutton @click="back" name="返回" />
    </div>
    <permission-dialog
      ref="permissionDialog"
      :taskId="taskInfo.id"
      :departs="departList"
      @refresh="refreshPermission"
      @close="closePermission"
    />
    <copy-permission-dialog
      ref="copyPermissionDialog"
      :taskId="taskInfo.id"
      @refresh="refresh"
    />
  </div>
</template>

<script>
import { initDeptTree } from "@/api/system";
import Vue from "vue";
import { USER_INFO } from "@/store/mutation-types";
import CopyPermissionDialog from "./copy-permission-dialog";
import PermissionDialog from "./permission-dialog";
import { getTaskFormList } from "@/api/task";
export default {
  components: { PermissionDialog, CopyPermissionDialog },
  name: "AddTaskStepThird",
  props: ["task"],
  data() {
    return {
      departList: [],
      departFilter: "",
      taskInfo: this.task,
      departProps: {
        children: "children",
        label: "name",
      },
      statusOptions: 0,
      formList: [],
      configFormList: [],
      loading: false,
      selectedRowKeys: [],
      headerStyle: {
        backgroundColor: "#F4F5F6",
      },
    };
  },
  watch: {
    departFilter(val) {
      this.$refs.departTree.filter(val);
    },
  },
  mounted() {
    this.initDepart();
    this.initData();
  },

  methods: {
    initData() {
      const { id, formCollectionId } = this.taskInfo;
      this.loading = true;
      getTaskFormList({ taskId: id, formCollectionId })
        .then((res) => {
          if (res.state) {
            this.formList = res.value.filter((item) => item.isCanFill);
            this.changeStatus(0);
          }
        })
        .finally(() => (this.loading = false));
    },

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

    applyPermissionBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning("请至少选择一行");
        return;
      }
      this.$refs.permissionDialog.edit(this.selectedRowKeys);
    },

    applyPermission(row) {
      this.$refs.permissionDialog.edit([row]);
    },

    refreshPermission(permissionForm) {
      this.formList.forEach((form) => {
        permissionForm.formIds.forEach((formId) => {
          if (form.formId == formId) {
            form.collaborateOrgName = permissionForm.collaborateOrgName;
            form.responsibleOrgName = permissionForm.responsibleOrgName;
          }
        });
      });
    },

    closePermission() {
      this.$refs.table.clearSelection();
    },

    copyPermission() {
      this.$refs.copyPermissionDialog.show();
    },

    frontStep() {
      this.$emit("change", 1);
    },

    nextStep() {
      let forms = this.formList.filter((form) => !form.responsibleOrgName);
      if (forms.length > 0) {
        this.$message.error("存在表单尚未配置负责部门，请检查!");
        return;
      }
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
