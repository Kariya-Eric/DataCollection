<template>
  <page-header-layout title="权限管理">
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <div v-action:query class="filter-container">
        <el-form label-position="right" label-width="80px" size="small">
          <el-row :gutter="48">
            <el-col :md="8" :sm="24">
              <el-form-item label="名称">
                <el-input
                  v-model="queryParam.query"
                  placeholder="名称/标识"
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
            <el-col :md="8" :sm="24">
              <div>
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
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- Query End -->
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
        @sort-change="sortChange"
      >
        <el-table-column type="index" width="80" />
        <el-table-column label="名称" prop="displayName" sortable="custom">
          <template v-slot="scope">
            <span class="link-type" @click="handleUpdate(scope.row)">{{
              scope.row.displayName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="唯一标识" prop="value" sortable="custom" />
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
        <el-table-column label="操作" width="160px">
          <template v-slot="scope">
            <el-button
              v-action:update
              type="text"
              @click="handleUpdate(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-action:delete
              type="text"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
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
    <el-dialog :visible.sync="dialogVisible" title="操作" top="80px">
      <div class="dialog-content">
        <el-form
          ref="dataForm"
          :model="mdl"
          :rules="rules"
          :label-position="(device !== 'desktop' && 'top') || 'right'"
          label-width="120px"
          size="small"
        >
          <el-form-item label="名称" prop="displayName">
            <el-input v-model="mdl.displayName" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="唯一标识" prop="value">
            <el-input v-model="mdl.value" placeholder="请输入唯一名称" />
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
          <el-form-item label="可选操作">
            <el-checkbox-group v-model="listCheckedActions">
              <el-checkbox
                v-for="(item, i) in listActions"
                :key="i"
                :label="item.value"
                >{{ item.displayName }}</el-checkbox
              >
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
          <el-button size="small" type="primary" @click="handleOK"
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
  getPermissionListByQuery,
  deletePermissionById,
  updatePermissionInfo,
  createPermission,
  getActionList
} from 'api/user';
import { parseTime } from 'utils';
import Pagination from 'components/Pagination'; // Secondary package based on el-pagination
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { mapState } from 'vuex';

export default {
  name: 'PermissionList',
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
      listData: null,
      listActions: [],
      listCheckedActions: [],
      listStatusOptions: [
        { value: '0', label: '全部' },
        { value: '1', label: '启用' },
        { value: '2', label: '禁用' }
      ],
      total: 0,
      totalPages: 0,
      isLoading: true,
      queryParam: {
        query: '',
        status: '0',
        sort: '',
        sortDir: '',
        pageIndex: 1,
        pageSize: 10
      },
      mdl: {},
      dialogVisible: false,
      isEdit: false,
      rules: {
        displayName: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '唯一标识不能为空', trigger: 'blur' }
        ],
        status: [{ required: true, message: '状态不能为空' }]
      }
    };
  },
  computed: {
    ...mapState('app', ['device'])
  },
  created() {
    this.getActions();
    this.getDataList();
  },
  methods: {
    getActions() {
      getActionList().then(response => {
        console.log(response);
        this.listActions = response.data;
      });
    },
    getDataList() {
      this.isLoading = true;
      getPermissionListByQuery(this.queryParam)
        .then(response => {
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleOK() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // assign actions
          this.mdl.listAvailableActions = [];
          this.listCheckedActions.map(av => {
            var theAct = this.listActions.filter(a => a.value === av)[0];
            this.mdl.listAvailableActions.push({
              displayName: theAct.displayName,
              value: theAct.value
            });
          });
          // console.log(this.mdl);
          if (!this.isEdit) {
            createPermission(this.mdl)
              .then(() => {
                this.dialogVisible = false;
                this.$message({
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getDataList();
              })
              .catch(error => {
                console.log(error);
              });
          } else {
            updatePermissionInfo(this.mdl).then(() => {
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
      this.listCheckedActions = [];
      this.mdl.listAvailableActions &&
        this.mdl.listAvailableActions.map(a => {
          this.listCheckedActions.push(a.value);
        });
      console.log(this.mdl);
      this.isEdit = true;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deletePermissionById(row.id).then(() => {
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
      this.multipleSelection.forEach(row => {
        this.handleDelete(row);
      });
      this.$refs.multipleTable.clearSelection();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
