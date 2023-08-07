<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="10">
        <el-card shadow="always" class="app-card">
          <div style="margin-bottom: 12px">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addDepart"
              >添加组织</el-button
            >
          </div>
          <el-input
            placeholder="输入部门名称"
            v-model="departFilter"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 12px"
          >
          </el-input>
          <el-tree
            class="filter-tree"
            :data="departList"
            :props="departProps"
            default-expand-all
            :expand-on-click-node="false"
            highlight-current
            :filter-node-method="filterNode"
            @current-change="changeSelect"
            ref="departTree"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-tabs
          type="border-card"
          v-model="activeTable"
          @tab-click="changeActiveTab"
        >
          <el-tab-pane label="组织信息" name="first">
            <el-empty
              description="请选择部门查看详细信息"
              v-if="Object.keys(selectedDept).length === 0"
            />
            <div v-else class="mainform">
              <el-form
                label-width="120px"
                :model="departForm"
                size="small"
                ref="departForm"
                :rules="departRules"
                v-loading="loading"
              >
                <el-form-item label="上级部门" prop="parentId">
                  <select-tree
                    :options="departList"
                    :value="departForm.parentId"
                    @getValue="getSelectedValue"
                    style="width: 100%"
                  />
                </el-form-item>
                <el-form-item label="部门名称" prop="name">
                  <el-input v-model="departForm.name" />
                </el-form-item>
                <el-form-item label="部门编码">
                  <el-input v-model="departForm.code" disabled />
                </el-form-item>
                <el-form-item label="排序" prop="orderNo">
                  <el-input-number :min="0" v-model="departForm.orderNo" />
                </el-form-item>
                <el-form-item label="职能类型" prop="type">
                  <el-select v-model="departForm.type" style="width: 100%">
                    <el-option label="职能部门" value="ZNBM" />
                    <el-option label="教学部门" value="JXBM" />
                  </el-select>
                </el-form-item>
                <el-form-item label="负责人">
                  <el-select
                    v-model="departForm.directorId"
                    style="width: 100%"
                  ></el-select>
                </el-form-item>
                <el-form-item label="联系人">
                  <el-select
                    v-model="departForm.contacts"
                    style="width: 100%"
                  ></el-select>
                </el-form-item>
                <el-form-item label="状态">
                  <el-switch
                    v-model="departForm.status"
                    :inactive-value="0"
                    :active-value="1"
                  />
                </el-form-item>
                <div class="formButton">
                  <el-popconfirm @confirm="delOrg" title="确认要删除该组织吗？">
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="small"
                      slot="reference"
                      >删除</el-button
                    >
                  </el-popconfirm>
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    size="small"
                    @click="submitDepart"
                    style="margin-right: 12px"
                    >保存</el-button
                  >
                </div>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="组织人员" name="second">
            <el-empty
              description="请选择部门查看详细信息"
              v-if="Object.keys(selectedDept).length === 0"
            />
            <div v-else>
              <div class="container">
                <el-form
                  label-width="50px"
                  size="small"
                  :inline="true"
                  label-position="left"
                  style="margin-bottom: 12px"
                >
                  <el-row>
                    <el-col :span="18">
                      <el-form-item label="姓名">
                        <el-input v-model="searchUserForm.keyWord" />
                      </el-form-item>
                      <el-form-item label="角色">
                        <el-select v-model="searchUserForm.roleId"></el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <div class="">
                        <el-popconfirm
                          title="确认要批量解除吗？"
                          @confirm="delOrgUserBatch"
                        >
                          <el-button
                            type="danger"
                            size="small"
                            icon="el-icon-delete"
                            slot="reference"
                            >批量解除</el-button
                          >
                        </el-popconfirm>
                        <el-button
                          type="primary"
                          size="small"
                          icon="el-icon-plus"
                          @click="addOrgUser"
                          >添加</el-button
                        >
                      </div></el-col
                    >
                  </el-row>
                </el-form>
                <el-table
                  :data="userList"
                  :loading="loading"
                  :border="true"
                  size="small"
                  @selection-change="onSelectChange"
                >
                  <el-table-column type="selection" align="center" />
                  <el-table-column label="帐号" prop="account" align="center" />
                  <el-table-column label="姓名" prop="account" align="center" />
                  <el-table-column
                    label="所属部门"
                    prop="orgName"
                    align="center"
                  />
                  <el-table-column label="状态" prop="status" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.status == 1 ? "正常" : "禁用" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="100">
                    <template slot-scope="scope">
                      <el-popconfirm
                        title="确认要解绑关系吗?"
                        @confirm="delOrgUser(scope.row)"
                      >
                        <a href="javascript:;" slot="reference">解绑关系</a>
                      </el-popconfirm>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <add-depart-user-dialog ref="addDepartUserDialog" @refresh="refreshUser" />
    <add-depart-dialog ref="addDepartDialog" @refresh="initDepart" />
  </div>
</template>

<script>
import Vue from "vue";
import { USER_INFO } from "@/store/mutation-types";
import AddDepartUserDialog from "./components/add-depart-user-dialog";
import AddDepartDialog from "./components/add-depart-dialog";
import {
  initDeptTree,
  getOrgInfo,
  getOrgUser,
  delOrg,
  delOrgUser,
  updateOrg,
} from "@/api/system";
export default {
  name: "DepartList",
  components: { AddDepartUserDialog, AddDepartDialog },
  data() {
    return {
      departProps: {
        children: "children",
        label: "name",
      },
      departList: [],
      departFilter: "",
      activeTable: "first",
      departForm: {},
      selectedDept: {},
      loading: false,
      userList: [],
      selectedRowKeys: [],
      searchUserForm: {
        keyWord: "",
        roleId: "",
      },
      departRules: {
        name: [{ required: true, message: "部门名称不能为空" }],
        type: [{ required: true, message: "职能类型不能为空" }],
        orderNo: [{ required: true, message: "排序不能为空" }],
        parentId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.departForm.parentId == undefined ||
                this.departForm.parentId == ""
              ) {
                callback(new Error("请选择上级部门"));
              } else if (value == this.departForm.id) {
                callback(new Error("上级部门不能为当前部门"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  watch: {
    departFilter(val) {
      this.$refs.departTree.filter(val);
    },
  },
  created() {
    this.initDepart();
  },
  methods: {
    addOrgUser() {
      this.$refs.addDepartUserDialog.show(this.selectedDept.code);
    },
    addDepart() {
      this.$refs.addDepartDialog.show(this.departList);
    },
    delOrgUserBatch() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请至少选择一项!");
        return;
      }
      let ids = this.selectedRowKeys.map((row) => row.id);
      let param = "ids=" + ids.join(",");
      this.loading = true;
      delOrgUser(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            let param = {
              orgId: this.selectedDept.id,
              keyWord: this.searchUserForm.keyWord,
              roleId: this.searchUserForm.roleId,
            };
            getOrgUser(param).then((res) => {
              this.userList = res;
            });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    delOrg() {
      let params = "id=" + this.selectedDept.id;
      delOrg(params).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.initDepart();
        } else {
          this.$message.error(res.message);
        }
      });
    },

    submitDepart() {
      this.$refs.departForm.validate((valid) => {
        if (valid) {
          updateOrg(this.departForm).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.initDepart();
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    initDepart() {
      let userInfo = Vue.ls.get(USER_INFO);
      this.selectedDept = {};
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = res.value;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    getSelectedValue(val) {
      this.departForm.parentId = val;
    },

    changeSelect(data, node) {
      this.selectedDept = data;
      this.loading = true;
      if (this.activeTable == "first") {
        getOrgInfo(this.selectedDept.id)
          .then((res) => {
            if (res.state) {
              this.departForm = res.value;
            }
          })
          .finally(() => (this.loading = false));
      } else if (this.activeTable == "second") {
        let param = {
          orgId: this.selectedDept.id,
          keyWord: this.searchUserForm.keyWord,
          roleId: this.searchUserForm.roleId,
        };
        getOrgUser(param)
          .then((res) => {
            this.userList = res;
          })
          .finally(() => (this.loading = false));
      }
    },

    refreshUser() {
      this.$message.success("添加成功！");
      this.loading = true;
      let param = {
        orgId: this.selectedDept.id,
        keyWord: this.searchUserForm.keyWord,
        roleId: this.searchUserForm.roleId,
      };
      getOrgUser(param)
        .then((res) => {
          this.userList = res;
        })
        .finally(() => (this.loading = false));
    },

    changeActiveTab(tab, event) {
      if (this.selectedDept.id) {
        this.loading = true;
        if (tab.name == "first") {
          getOrgInfo(this.selectedDept.id)
            .then((res) => {
              if (res.state) {
                this.departForm = res.value;
              }
            })
            .finally(() => (this.loading = false));
        } else if (tab.name == "second") {
          let param = {
            orgId: this.selectedDept.id,
            keyWord: this.searchUserForm.keyWord,
            roleId: this.searchUserForm.roleId,
          };
          getOrgUser(param)
            .then((res) => {
              this.userList = res;
            })
            .finally(() => (this.loading = false));
        }
      }
    },

    delOrgUser(row) {
      let ids = [];
      ids.push(row.id);
      let param = "ids=" + ids.join(",");
      this.loading = true;
      delOrgUser(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            let param = {
              orgId: this.selectedDept.id,
              keyWord: this.searchUserForm.keyWord,
              roleId: this.searchUserForm.roleId,
            };
            getOrgUser(param).then((res) => {
              this.userList = res;
            });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped lang="scss">
.mainform {
  width: 85%;
  margin: auto;
  margin-top: 24px;
  margin-bottom: 24px;
}
.formButton {
  text-align: center;
}
.container {
  padding: 18px;
}
</style>
