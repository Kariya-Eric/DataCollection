<template>
  <page-header-layout title="用户管理">
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <div v-action:query class="filter-container">
        <el-form label-position="right" label-width="80px" size="small">
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="关键字">
                <el-input
                  v-model="queryParam.query"
                  placeholder="用户名/姓名/电话/邮箱"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="状态">
                <el-select
                  v-model="queryParam.status"
                  placeholder="状态"
                  style="width: 100%;"
                >
                  <el-option
                    v-for="(item, index) in listStatusOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="角色">
                  <el-select
                    v-model="queryParam.roleId"
                    placeholder="角色"
                    clearable
                    style="width: 100%;"
                  >
                    <el-option
                      v-for="item in listRoles"
                      :key="item.id"
                      :label="item.displayName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </template>
            <el-col :md="(!advanced && 8) || 24" :sm="24">
              <div
                class="operation-btn"
                :style="
                  (advanced &&
                    device === 'desktop' && {
                      float: 'right',
                      overflow: 'hidden'
                    }) ||
                    {}
                "
              >
                <el-button
                  v-waves
                  class="filter-item"
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  @click="handleQuery"
                  >查询</el-button
                >
                <el-button
                  v-action:add
                  class="filter-item"
                  style="margin-left: 10px;"
                  type="primary"
                  icon="el-icon-plus"
                  size="small"
                  @click="handleCreate"
                  >新建</el-button
                >
                <el-button
                  v-action:export
                  v-waves
                  :loading="isDownloading"
                  class="filter-item"
                  type="primary"
                  icon="el-icon-download"
                  size="small"
                  @click="handleExport"
                  >导出</el-button
                >
                <el-link
                  type="primary"
                  :underline="false"
                  @click="toggleAdvanced"
                  style="margin-left: 8px"
                >
                  {{ advanced ? '收起' : '展开' }}
                  <i
                    class="el-icon--right"
                    :class="
                      advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
                    "
                  ></i>
                </el-link>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- Query End -->
      <!-- Batch Operation Start -->
      <div style="padding-bottom: 10px;">
        <el-button-group>
          <el-button
            v-action:delete
            v-waves
            class="filter-item"
            size="small"
            type="danger"
            plain
            @click="handleBatchDelete"
            >批量删除</el-button
          >
          <el-button
            v-action:update
            v-waves
            class="filter-item"
            size="small"
            type="primary"
            plain
            @click="handleBatchUpdateStatus(1)"
            >批量启用</el-button
          >
          <el-button
            v-action:update
            v-waves
            class="filter-item"
            size="small"
            type="primary"
            plain
            @click="handleBatchUpdateStatus(0)"
            >批量禁用</el-button
          >
        </el-button-group>
      </div>
      <!-- Batch Operation End -->
      <!-- Table Start -->
      <el-table
        ref="multipleTable"
        :key="tableKey"
        v-loading="isLoading"
        :data="listData"
        fit
        highlight-current-row
        style="width: 100%;"
        size="medium"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" width="80" />
        <el-table-column label="用户名" prop="userName" sortable="custom">
          <template v-slot="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{
              scope.row.userName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" sortable="custom" />
        <el-table-column label="电话" prop="phoneNo" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="上次登录" prop="lastLoginTime" width="150px">
          <template v-slot="scope">
            <span>{{ scope.row.lastLoginTime | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100">
          <template v-slot="scope">
            <el-tag :type="scope.row.status | statusColorFilter">{{
              scope.row.status | statusTextFilter
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="备注"
          prop="description"
          width="300px"
          show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              v-action:update
              type="text"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-dropdown trigger="click">
              <span class="link-type">
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <template v-slot:dropdown>
                <el-dropdown-menu style="text-align: center;">
                  <el-dropdown-item
                    v-action:update
                    :disabled="scope.row.status === 1"
                    @click.native="handleUpdateStatus(scope.row, 1)"
                    >启用</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-action:update
                    :disabled="scope.row.status === 0"
                    @click.native="handleUpdateStatus(scope.row, 0)"
                    >禁用</el-dropdown-item
                  >
                  <el-dropdown-item
                    v-action:delete
                    divided
                    @click.native="handleDelete(scope.row)"
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParam.pageIndex"
        :limit.sync="queryParam.pageSize"
        @pagination="getDataList"
      />
      <!-- Table End -->
    </el-card>
    <!-- Dialog Start -->
    <el-dialog :visible.sync="dialogVisible" title="操作" top="20px">
      <div class="dialog-content">
        <el-form
          ref="dataForm"
          :model="mdl"
          :rules="rules"
          :label-position="(device !== 'desktop' && 'top') || 'right'"
          label-width="120px"
          size="small"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="mdl.userName" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item v-if="isEdit === false" label="密码" prop="password">
            <el-input v-model="mdl.password" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="mdl.name" />
          </el-form-item>
          <el-form-item label="电话" prop="phoneNo">
            <el-input v-model="mdl.phoneNo" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="mdl.email" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="mdl.status">
              <el-radio label="0">禁用</el-radio>
              <el-radio label="1">启用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="mdl.description"
              :autosize="{ minRows: 3, maxRows: 10 }"
              type="textarea"
              placeholder="备注"
            />
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="listCheckedRoles">
              <el-checkbox v-for="(r, i) in listRoles" :key="i" :label="r.id">{{
                r.displayName
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <template v-slot:footer>
        <div
          class="dialog-footer"
          style="display: flex; justify-content: center;"
        >
          <el-button size="small" @click="dialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" size="small" @click="handleOK"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- Dialog End -->
  </page-header-layout>
</template>

<script>
import {
  getUserList,
  getRoleList,
  deleteUserById,
  updateUserStatus,
  updateUserInfo,
  createUser
} from 'api/user';
import { parseTime } from 'utils';
import Pagination from 'components/Pagination'; // Secondary package based on el-pagination
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { mapState } from 'vuex';

export default {
  components: { Pagination, PageHeaderLayout },
  filters: {
    statusColorFilter(status) {
      return status === 1 ? 'success' : 'danger';
    },
    statusTextFilter(status) {
      return status === 1 ? '启用' : '禁用';
    },
    parseTime(time) {
      return time ? parseTime(time, '{y}-{m}-{d} {h}:{i}') : '';
    }
  },
  data() {
    return {
      tableKey: 0,
      // 搜索高级
      advanced: false,
      listData: null,
      listStatusOptions: [
        { value: '0', label: '全部' },
        { value: '1', label: '启用' },
        { value: '2', label: '禁用' }
      ],
      listRoles: [],
      listCheckedRoles: [],
      total: 0,
      totalPages: 0,
      isLoading: true,
      queryParam: {
        query: '',
        status: '0',
        roleId: '',
        sort: '',
        sortDir: '',
        pageIndex: 1,
        pageSize: 10
      },
      mdl: {},
      dialogVisible: false,
      isEdit: false,
      multipleSelection: [],
      rules: {
        userName: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ]
      },
      isDownloading: false
    };
  },
  computed: {
    ...mapState('app', ['device'])
  },
  created() {
    this.getRoles();
    this.getDataList();
  },
  methods: {
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    getRoles() {
      getRoleList().then((response) => {
        console.log(response);
        this.listRoles = response.data;
      });
    },
    getDataList() {
      this.isLoading = true;
      getUserList(this.queryParam)
        .then((response) => {
          console.log(response);
          var data = response.data;
          this.listData = data.lstData;
          this.total = data.totalCount;
          this.totalPages = data.totalPages;
          this.isLoading = false;
        })
        .catch();
    },
    handleQuery() {
      this.queryParam.pageIndex = 1;
      this.getDataList();
    },
    handleUpdateStatus(row, status) {
      updateUserStatus(row.id, status).then(() => {
        row.status = status;
        this.$message({
          message: '操作成功',
          type: 'success'
        });
      });
    },
    sortChange(data) {
      console.log(data);
      const { prop, order } = data;
      this.queryParam.sort = prop;
      this.queryParam.sortDir = order;
      this.handleQuery();
    },
    resetMdl() {
      this.mdl = {};
    },
    handleCreate() {
      this.resetMdl();
      this.isEdit = false;
      this.dialogVisible = true;
      this.listCheckedRoles = [];
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleOK() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // assign roles
          this.mdl.listUserRoles = [];
          this.listCheckedRoles.map((rid) => {
            var theRole = this.listRoles.filter((a) => a.id === rid)[0];
            var tmpUR = {
              roleId: rid,
              roleValue: theRole.value,
              roleName: theRole.displayName
            };
            this.mdl.listUserRoles.push(tmpUR);
          });
          console.log(this.mdl);
          if (!this.isEdit) {
            createUser(this.mdl)
              .then(() => {
                this.dialogVisible = false;
                this.$message({
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getDataList();
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            updateUserInfo(this.mdl).then(() => {
              this.dialogVisible = false;
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 2000
              });
              this.getDataList();
            });
          }
        }
      });
    },
    handleUpdate(row) {
      this.mdl = { ...row }; // copy obj
      this.mdl.status = this.mdl.status.toString(); // el-radio issue
      this.listCheckedRoles = [];
      this.mdl.listUserRoles &&
        this.mdl.listUserRoles.map((ur) => {
          this.listCheckedRoles.push(ur.roleId);
        });
      console.log(this.mdl);
      this.isEdit = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteUserById(row.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.listData.indexOf(row);
            this.listData.splice(index, 1);
          });
        })
        .catch();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    testSelection() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请先选择',
          type: 'error'
        });
        return false;
      }
      return true;
    },
    handleBatchDelete() {
      if (!this.testSelection()) {
        return;
      }
      this.multipleSelection.forEach((row) => {
        this.handleDelete(row);
      });
      this.$refs.multipleTable.clearSelection();
    },
    handleBatchUpdateStatus(status) {
      if (!this.testSelection()) {
        return;
      }
      this.multipleSelection.forEach((row) => {
        this.handleUpdateStatus(row, status);
      });
      this.$refs.multipleTable.clearSelection();
    },
    handleExport() {
      this.isDownloading = true;
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '用户名',
          '姓名',
          '电话',
          '邮箱',
          '上次登录',
          '状态',
          '备注'
        ];
        const filterVal = [
          'userName',
          'name',
          'phoneNo',
          'email',
          'lastLoginTime',
          'status',
          'description'
        ];
        this.getAllData().then((res) => {
          var allData = res;
          console.log(allData);
          const data = this.formatJson(filterVal, allData);
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '用户列表'
          });
          this.isDownloading = false;
        });
      });
    },
    async getAllData() {
      var allData = [];
      for (var i = 1; i <= this.totalPages; i++) {
        await getUserList(
          this.queryParam.query,
          this.queryParam.status,
          this.queryParam.roleId,
          this.queryParam.sort,
          this.queryParam.sortDir,
          i,
          this.queryParam.pageSize
        )
          .then((response) => {
            console.log(response);
            allData = allData.concat(response.data.lstData);
          })
          .catch();
      }
      console.log(allData);
      return allData;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'lastLoginTIme') {
            return parseTime(v[j]);
          } else if (j === 'status') {
            return v[j] === 1 ? '启用' : '禁用';
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
<style lang="scss" scoped>
// .operation-btn {
//   float: right;
// }
// .mobile {
//   .operation-btn {
//     float: left;
//   }
// }
</style>
