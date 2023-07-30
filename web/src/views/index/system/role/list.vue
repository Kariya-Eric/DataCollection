<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-form
        label-width="70px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="角色名称">
          <el-input v-model="queryParam.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色状态">
          <el-select
            v-model="queryParam.enabled"
            clearable
            placeholder="请选择"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <Mbutton type="primary" @click="searchQuery" name="搜索" />
        <Mbutton type="primary" @click="searchReset" name="重置" />
      </el-form>
      <!-- Query End -->

      <div class="listHeader">
        <span>角色管理</span>
        <div class="listHeaderButton">
          <Mbutton
            type="danger"
            v-if="selectedRowKeys.length > 0"
            @click="delBatch"
            name="批量删除"
          />
          <Mbutton
            @click="addRole"
            type="primary"
            name="添加角色"
            icon="新建"
          />
        </div>
      </div>

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        :border="true"
        class="listTable"
        :header-cell-style="headerStyle"
      >
        <el-table-column label="角色名称" prop="name" align="center" />
        <el-table-column label="角色编码" prop="code" align="center" />
        <el-table-column label="状态" prop="enabled" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          prop="updateTime"
          align="center"
          sortable
        />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <a href="javascript:;" @click="updateRole(scope.row)">编辑</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="showPermission(scope.row)">授权</a>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
    </el-card>
    <role-dialog ref="roleDialog" @refresh="loadData" />
    <role-permission-drawer ref="rolePermissionDrawer" />
  </div>
</template>

<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import RoleDialog from "./components/role-dialog";
import RolePermissionDrawer from "./components/role-permission-drawer";
export default {
  name: "RoleList",
  mixins: [DataCollectionMixin],
  components: {
    RoleDialog,
    RolePermissionDrawer,
  },
  data() {
    return {
      url: {
        list: "/uc/api/role/getRolePage",
      },
    };
  },
  methods: {
    addRole() {
      this.$refs.roleDialog.show(true);
    },

    updateRole(info) {
      this.$refs.roleDialog.show(false, info);
    },

    showPermission(row) {
      this.$refs.rolePermissionDrawer.show(row);
    },
  },
};
</script>

<style scoped lang="scss"></style>
