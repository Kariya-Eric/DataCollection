<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-form
        label-width="50px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="部门">
          <el-select
            v-model="queryParam.orgId"
            clearable
            placeholder="请选择部门"
          >
            <!-- TODO -->
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryParam.queryWord"
            placeholder="请输入姓名,帐号,手机"
          />
        </el-form-item>
        <mbutton type="primary" @click="searchQuery" name="搜索" />
        <mbutton type="primary" @click="searchReset" name="重置" />
      </el-form>

      <div class="listHeader">
        <span>用户管理</span>
        <div class="listHeaderButton">
          <mbutton
            type="danger"
            v-if="selectedRowKeys.length > 0"
            @click="delBatch"
            name="批量删除"
          />
          <mbutton
            @click="addUser"
            type="primary"
            name="添加用户"
            icon="新建"
          />
          <mbutton type="primary" name="导入" />
          <mbutton type="primary" name="导出" />
        </div>
      </div>

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        class="listTable"
        :header-cell-style="headerStyle"
        :border="true"
        @selection-change="onSelectChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="帐号" prop="account" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="所属部门" prop="orgName" align="center" />
        <el-table-column label="邮箱" prop="email" align="center" />
        <el-table-column label="手机号" prop="mobile" align="center" />
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
            <a href="javascript:;" @click="showUser(scope.row)">查看</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="updateUser(scope.row)">编辑</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="resetPwd(scope.row)">重置密码</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
    </el-card>
    <user-drawer ref="userDrawer" @refresh="loadData" />
    <reset-password-dialog ref="resetPasswordDialog" />
  </div>
</template>

<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import UserDrawer from "./components/user-drawer";
import ResetPasswordDialog from "./components/reset-password-dialog";
export default {
  name: "UserList",
  mixins: [DataCollectionMixin],
  components: { UserDrawer, ResetPasswordDialog },
  data() {
    return {
      url: {
        list: "/uc/api/user/getUserPage",
        delBatch: "/uc/api/user/deleteUserByIds",
      },
    };
  },
  methods: {
    addUser() {
      this.$refs.userDrawer.show(true);
    },
    showUser(info) {
      this.$refs.userDrawer.show(false, false, info);
    },
    updateUser(info) {
      this.$refs.userDrawer.show(false, true, info);
    },

    resetPwd(info) {
      this.$refs.resetPasswordDialog.show(info);
    },
  },
};
</script>

<style scoped lang="scss"></style>
