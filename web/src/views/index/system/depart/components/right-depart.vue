<template>
  <div>
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="组织信息" name="first">
        <el-empty description="请选择部门查看详细信息" v-if="departId == ''" />
        <div v-else class="mainform">
          <el-form
            label-width="120px"
            :model="departForm"
            size="small"
            ref="departForm"
            :rules="departRules"
            v-loading="loading"
          >
            <el-form-item label="职能类型" prop="type">
              <el-select
                v-model="departForm.type"
                style="width: 100%"
                :disabled="true"
              >
                <el-option label="职能部门" value="functional" />
                <el-option label="教学部门" value="teaching" />
              </el-select>
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="departForm.name" :disabled="!isEdit" />
            </el-form-item>
            <el-form-item label="部门编码">
              <el-input v-model="departForm.code" disabled />
            </el-form-item>
            <el-form-item label="排序" prop="orderNo">
              <el-input-number
                :min="0"
                v-model="departForm.orderNo"
                :disabled="!isEdit"
              />
            </el-form-item>
            <el-form-item label="负责人">
              <el-select
                :disabled="!isEdit"
                v-model="departForm.responsibleUser"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="user in users"
                  :key="user.id"
                  :label="user.name"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="联系人">
              <el-select
                :disabled="!isEdit"
                v-model="departForm.contactUser"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="user in users"
                  :key="user.id"
                  :label="user.name"
                  :value="user.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch
                :disabled="!isEdit"
                v-model="departForm.status"
                :inactive-value="0"
                :active-value="1"
              />
            </el-form-item>
            <div class="formButton" v-if="isEdit">
              <mbutton type="primary" name="保存" @click="submitDepart" />
              <mbutton name="取消" @click="close" />
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="人员信息" name="second">
        <el-empty description="请选择部门查看详细信息" v-if="departId == ''" />
        <div v-else>
          <el-form
            label-width="80px"
            size="small"
            :inline="true"
            class="headerForm"
          >
            <el-form-item label="角色">
              <el-select v-model="searchUserForm.roleId">
                <el-option
                  v-for="item in roleList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
              /></el-select>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="searchUserForm.name" />
            </el-form-item>
            <mbutton type="primary" name="搜索" @click="getOrgUserList" />
            <mbutton name="重置" @click="resetUserForm" />
          </el-form>

          <div class="listHeader">
            <span>人员列表</span>
            <div class="listHeaderButton">
              <el-popconfirm
                title="确认删除吗？"
                @confirm="delUserBatch"
                v-if="selectedRowKeys.length > 0"
              >
                <mbutton type="danger" slot="reference" name="批量删除" />
              </el-popconfirm>
              <mbutton
                type="primary"
                name="添加"
                icon="新建"
                @click="addUser"
              />
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="userList"
            class="listTable"
            :header-cell-style="headerStyle"
            :border="true"
            @selection-change="onSelectChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="帐号" prop="account" align="center" />
            <el-table-column label="姓名" prop="name" align="center" />
            <el-table-column label="所属部门" prop="orgName" align="center" />
            <el-table-column label="角色" prop="roleName" align="center" />
            <el-table-column label="状态" prop="status" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <menu-link @click="showUser(scope.row)">查看</menu-link>
                <menu-link @click="editUser(scope.row)">编辑</menu-link>
                <el-popconfirm
                  title="确认删除吗？"
                  @confirm="delUser(scope.row)"
                >
                  <menu-link no-divider slot="reference">删除</menu-link>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <pagination :pagination="ipagination" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <user-dialog ref="userDialog" :orgId="departId" @refresh="getOrgUserList" />
  </div>
</template>

<script>
import { getUserList, delUserBatch } from "@/api/system/user";
import { updateOrg, getOrgUser, getOrg } from "@/api/system/depart";
import { getRoleList } from "@/api/system/role";
import UserDialog from "../../user/components/user-dialog";
export default {
  components: { UserDialog },
  name: "RightDepart",
  props: ["departId", "isEdit"],
  data() {
    return {
      activeTab: "first",
      departForm: {},
      loading: false,
      departRules: {
        name: [{ required: true, message: "部门名称不能为空" }],
        type: [{ required: true, message: "职能类型不能为空" }],
        orderNo: [{ required: true, message: "排序不能为空" }],
      },
      users: [],
      userList: [],
      roleList: [],
      searchUserForm: {
        roleId: "",
        name: "",
      },
      headerStyle: {
        backgroundColor: "#F4F5F6",
      },
      selectedRowKeys: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
    };
  },
  watch: {
    departId(newVal) {
      this.activeTab = "first";
      if (newVal != "") {
        this.initUserList(newVal);
        this.getOrgById(newVal);
      }
    },
    activeTab(newVal) {
      if (newVal == "second") {
        this.getOrgUserList();
      }
    },
  },
  mounted() {
    this.initRole();
  },
  methods: {
    initRole() {
      getRoleList({}).then((res) => {
        if (res.state) {
          this.roleList = res.value.rows;
        }
      });
    },
    getOrgById(id) {
      this.loading = true;
      getOrg(id)
        .then((res) => {
          if (res.state) {
            this.departForm = res.value;
          }
        })
        .finally(() => (this.loading = false));
    },

    initUserList(orgId) {
      getUserList({}).then((res) => {
        if (res.state) {
          this.users = res.value.rows.filter((user) => user.orgId == orgId);
        }
      });
    },

    getOrgUserList() {
      let param = {
        orgId: this.departForm.id,
        keyWord: this.searchUserForm.name,
        roleId: this.searchUserForm.roleId,
      };
      this.loading = true;
      getOrgUser(param)
        .then((res) => {
          this.userList = res;
        })
        .finally(() => (this.loading = false));
    },

    close() {
      this.$emit("close");
    },

    submitDepart() {
      this.$refs.departForm.validate((valid) => {
        if (valid) {
          updateOrg(this.departForm).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.$emit("refresh");
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },

    resetUserForm() {
      this.searchUserForm = {
        roleId: "",
        name: "",
      };
      this.getOrgUserList();
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys;
    },

    addUser() {
      this.$refs.userDialog.show(true);
    },

    showUser(info) {
      this.$refs.userDialog.show(false, false, info);
    },

    editUser(info) {
      this.$refs.userDialog.show(false, true, info);
    },

    delUserBatch() {
      let ids =
        "ids=" + this.selectedRowKeys.map((element) => element.id).join(",");
      this.loading = true;
      delUserBatch(ids)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getOrgUserList();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = true;
        });
    },

    delUser(row) {
      let ids = "ids=" + row.id;
      this.loading = true;
      delUserBatch(ids)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getOrgUserList();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = true;
        });
    },
  },
};
</script>

<style scoped lang="scss">
.formButton {
  text-align: center;
  .el-button {
    margin-left: 12px;
  }
}
</style>
