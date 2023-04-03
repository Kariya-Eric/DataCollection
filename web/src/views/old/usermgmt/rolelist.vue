<template>
  <page-header-layout title="角色管理">
    <el-card shadow="always" class="app-card">
      <el-row :gutter="48">
        <el-col :md="4" style="padding: 20px 30px;">
          <div
            v-for="(item, index) in listRoles"
            :key="index"
            style="display: flex; flex-direction: column; align-items: center; padding: 10px 0px; border-bottom: 1px solid #dcdfe6;"
          >
            <div style="margin: 8px 0px;">
              <span>
                <a href="#" @click="handleClickRole(item)">{{
                  item.displayName
                }}</a>
              </span>
            </div>
            <div>
              <span style="font-size: 12px; color: gray;">{{
                item.description
              }}</span>
            </div>
          </div>
          <div
            v-action:add
            style="display: flex; flex-direction: column; align-items: center; padding: 10px 0px;"
          >
            <div style="margin: 8px 0px;">
              <el-button
                v-waves
                type="primary"
                icon="el-icon-plus"
                size="small"
                circle
                @click="handleCreateRole"
              />
            </div>
            <div>
              <span style="font-size: 12px; color: gray;">新建一个角色</span>
            </div>
          </div>
        </el-col>

        <el-col :md="20">
          <el-form
            ref="dataForm"
            :model="mdl"
            :rules="rules"
            style="max-width: 800px; padding: 20px 30px;"
            label-position="top"
            size="small"
          >
            <el-form-item label="角色名称" prop="displayName">
              <el-input v-model="mdl.displayName" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="唯一标识" prop="value">
              <el-input v-model="mdl.value" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="mdl.status" style="width: 100%;">
                <el-option
                  v-for="item in listStatusOptions"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="description">
              <el-input
                v-model="mdl.description"
                placeholder="请输入"
                type="textarea"
              />
            </el-form-item>

            <div>
              <div style="padding: 10px 0px; font-size: 14px;">
                <span style="color: #60626;">拥有权限：</span>
              </div>
              <div>
                <el-row
                  v-for="(perm, index) in listPermissions"
                  :key="index"
                  style="padding: 10px 0px;"
                >
                  <el-col :span="4" style="font-size: 14px; color: gray;"
                    >{{ perm.displayName }}：</el-col
                  >
                  <el-col :span="20">
                    <div style="display: flex;">
                      <el-checkbox
                        v-model="permSelectedAll[perm.id]"
                        style="margin-right: 30px;"
                        @change="handleSelectAll(perm)"
                        >全选</el-checkbox
                      >
                      <el-checkbox-group
                        v-model="permSelectedActions[perm.id]"
                        @change="handleCheckedPermChange(perm)"
                      >
                        <el-checkbox
                          v-for="(a, i) in perm.listAvailableActions"
                          :key="i"
                          :label="a.value"
                        >
                          {{ a.displayName }}
                        </el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <div
              style="padding: 30px 0; display: flex; justify-content: center;"
            >
              <el-button
                v-action:update
                type="primary"
                size="small"
                @click="handleOK"
                >保存</el-button
              >
              <el-button
                v-action:delete
                type="danger"
                size="small"
                @click="handleDelete"
                >删除</el-button
              >
            </div>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </page-header-layout>
</template>

<script>
import {
  getRoleList,
  getPermissionList,
  deleteRoleById,
  updateRoleInfo,
  createRole
} from 'api/user';

import PageHeaderLayout from 'layouts/PageHeaderLayout';

export default {
  components: { PageHeaderLayout },
  data() {
    return {
      listRoles: [],
      listPermissions: [],
      permSelectedActions: {},
      permSelectedAll: {},
      listStatusOptions: [
        { value: 1, label: '正常' },
        { value: 0, label: '禁用' }
      ],
      mdl: {},
      checkList: [],
      isEdit: false,
      rules: {
        displayName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        value: [{ required: true, message: '标识不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '状态不能为空', trigger: 'blur' }]
      }
    };
  },
  computed: {},
  created() {
    this.refreshRoleList();
    getPermissionList()
      .then(res => {
        this.listPermissions = res.data;
        this.listPermissions.map(perm => {
          // 注意这里必须使用$set
          this.$set(this.permSelectedActions, perm.id, []);
          this.$set(this.permSelectedAll, perm.id, false);
        });
      })
      .catch(err => console.log(err));
  },
  methods: {
    refreshRoleList() {
      getRoleList()
        .then(res => {
          this.listRoles = res.data;
        })
        .catch(err => console.log(err));
    },
    clearStatus() {
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
      this.listPermissions.map(perm => {
        // 注意这里必须使用$set
        this.$set(this.permSelectedActions, perm.id, []);
        this.$set(this.permSelectedAll, perm.id, false);
      });
    },
    handleCreateRole() {
      this.mdl = {};
      this.isEdit = false;
      this.clearStatus();
    },
    handleClickRole(item) {
      console.log(this.mdl);
      this.mdl = item;
      this.isEdit = true;
      this.clearStatus();
      // set the corresponding permissions
      if (this.mdl.listPermissions && this.mdl.listPermissions.length > 0) {
        this.mdl.listPermissions.forEach(rp => {
          this.permSelectedActions[rp.permissionId] = [
            ...rp.listAssignedActions
          ];
        });
      }
    },
    handleSelectAll(perm) {
      const isAll = this.permSelectedAll[perm.id];
      if (isAll) {
        console.log('check all ' + perm.id);
        var allActions = this.listPermissions.filter(p => p.id === perm.id)[0]
          .listAvailableActions;
        this.permSelectedActions[perm.id] = allActions.map(a => {
          return a.value;
        });
      } else {
        console.log('clear all ' + perm.id);
        this.permSelectedActions[perm.id] = [];
      }
    },
    handleCheckedPermChange(perm) {
      // console.log(this.permSelectedActions);
      // save all assignedActions of perm to the role
      // var rp = this.mdl.listPermissions.filter(a => a.permissionId === perm.id)[0];
      // rp.listAssignedActions
    },
    handleOK() {
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          return;
        }
        // assign permissions
        this.mdl.listPermissions = [];
        for (var pid in this.permSelectedActions) {
          // console.log(this.permSelectedActions[pid]);
          if (this.permSelectedActions[pid].length > 0) {
            var tempRP = {
              permissionId: pid,
              listAssignedActions: [...this.permSelectedActions[pid]]
            };
            this.mdl.listPermissions.push(tempRP);
          }
        }
        console.log(this.mdl);
        // save to server
        if (this.isEdit) {
          console.log('updating...');
          updateRoleInfo(this.mdl).then(() => {
            this.$message({
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
          });
        } else {
          console.log('creating...');
          createRole(this.mdl)
            .then(() => {
              this.$message({
                message: '创建成功',
                type: 'success',
                duration: 2000
              });
              this.refreshRoleList();
              this.clearStatus();
              this.mdl = {};
            })
            .catch(error => {
              console.log(error);
            });
        }
      });
    },
    handleDelete() {
      var self = this;
      if (!this.mdl.id) {
        this.$message({
          message: '请选择一个角色',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteRoleById(self.mdl.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            this.refreshRoleList();
            this.clearStatus();
            this.mdl = {};
            this.isEdit = false;
          });
        })
        .catch();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
