<template>
  <div class="main-form" style="overflow: hidden">
    <el-row :gutter="24">
      <el-col :span="6">
        <div>
          <el-row style="margin-bottom: 24px">
            <el-col :span="6"> <span style="line-height: 32px">部门名称</span></el-col>
            <el-col :span="18"> <el-input v-model="departFilter" placeholder="请输入部门名称搜索" @input="searchDepart" clearable /></el-col>
          </el-row>
          <depart-tree :departList="departList" :loading="loading" ref="departTree" @select="selectDepart" />
        </div>
      </el-col>
      <el-col :span="18">
        <div class="right-side">
          <div class="header">
            <el-row>
              <span>权限配置状态&nbsp;&nbsp;&nbsp;</span>
              <el-select v-model="statusOptions" @change="changeStatus">
                <el-option label="全部" :value="0" />
                <el-option label="已配置" :value="1" />
                <el-option label="未配置" :value="2" />
              </el-select>
              <div style="float: right">
                <el-button type="primary" @click="copyPermission">复制其他任务权限</el-button>
                <el-button type="primary" @click="applyPermissionBatch">批量配置权限</el-button>
              </div>
            </el-row>
          </div>

          <dc-table :data="configFormList" ref="table" v-loading="loading" @selection-change="onSelectChange" :columns="columns" selection="selection">
            <template slot="formName" slot-scope="scope">
              <svg-icon icon-class="固定表单" width="16px" height="16px" v-if="scope.row.formType == '固定表单'" />
              <svg-icon icon-class="浮动表单" width="16px" height="16px" v-else />
              <span>{{ scope.row.formName }}</span>
            </template>
            <template slot="configStatus" slot-scope="scope">
              <el-tag v-if="scope.row.configStatus">已配置</el-tag>
              <el-tag v-else>未配置</el-tag>
            </template>
            <template slot="action" slot-scope="scope">
              <a @click="applyPermission(scope.row)">配置权限</a>
            </template>
          </dc-table>
        </div>
      </el-col>
    </el-row>
    <div class="footer">
      <el-button type="primary" @click="frontStep">上一步</el-button>
      <el-button type="primary" @click="nextStep">下一步</el-button>
      <el-button @click="back">返回</el-button>
    </div>
    <permission-dialog ref="permissionDialog" :taskId="taskInfo.id" :departs="departList" @refresh="refreshPermission" @close="$refs.table.clearSelection()" />
    <copy-permission-dialog ref="copyPermissionDialog" :taskId="taskInfo.id" @close="refresh" />
  </div>
</template>

<script>
import { initDeptTree } from '@/api/system'
import DepartTree from './depart-tree.vue'
import Vue from 'vue'
import { USER_INFO } from '@/store/mutation-types'
import CopyPermissionDialog from './copy-permission-dialog'
import PermissionDialog from './permission-dialog'
import { getTaskFormList } from '@/api/task'
export default {
  components: { PermissionDialog, CopyPermissionDialog, DepartTree },
  name: 'AddTaskStepThird',
  props: ['task'],
  data() {
    return {
      departList: [],
      departFilter: '',
      taskInfo: this.task,
      statusOptions: 0,
      formList: [],
      configFormList: [],
      loading: false,
      selectedRowKeys: [],
      columns: [
        { slot: 'formName', label: '表单名称' },
        { slot: 'configStatus', label: '权限配置状态' },
        { prop: 'responsibleOrgName', label: '负责部门' },
        { prop: 'collaborateOrgName', label: '协作部门' },
        { slot: 'action', label: '操作' }
      ]
    }
  },

  mounted() {
    this.initDepart()
    this.initData()
  },

  methods: {
    selectDepart(val) {
      if (val.grade == 'COMMON' && val.name != '职能部门' && val.name != '教学部门') {
        //顶级
        this.changeStatus(this.statusOptions)
      } else if (val.grade == 'COMMON' && (val.name == '职能部门' || val.name == '教学部门')) {
        //二级
        let ids = val.children.map(dept => dept.name)
        if (this.statusOptions == 0) {
          this.configFormList = this.formList.filter(form => {
            let index = ids.indexOf(form.responsibleOrgName)
            return index != -1
          })
        } else if (this.statusOptions == 1) {
          this.configFormList = this.formList.filter(form => {
            let index = ids.indexOf(form.responsibleOrgName)
            return index != -1 && form.configStatus
          })
        } else {
          this.configFormList = this.formList.filter(form => {
            let index = ids.indexOf(form.responsibleOrgName)
            return index != -1 && !form.configStatus
          })
        }
      } else if (val.grade != 'COMMON') {
        if (this.statusOptions == 0) {
          this.configFormList = this.formList.filter(form => form.responsibleOrgName == val.name)
        } else if (this.statusOptions == 1) {
          this.configFormList = this.formList.filter(form => form.configStatus && form.responsibleOrgName == val.name)
        } else {
          this.configFormList = this.formList.filter(form => !form.configStatus && form.responsibleOrgName == val.name)
        }
      }
    },

    searchDepart() {
      this.$refs.departTree.filter(this.departFilter)
    },

    initData() {
      const { id, formCollectionId } = this.taskInfo
      this.loading = true
      getTaskFormList({ taskId: id, formCollectionId })
        .then(res => {
          if (res.state) {
            this.formList = res.value.filter(item => item.isCanFill)
            this.changeStatus(0)
          }
        })
        .finally(() => (this.loading = false))
    },

    refresh() {
      //TODO 配置完成的回显
      this.$refs.table.clearSelection()
      this.initData()
    },

    onSelectChange(selectedRowKeys, _) {
      this.selectedRowKeys = selectedRowKeys
    },
    changeStatus(val) {
      if (val == 0) {
        this.configFormList = this.formList
      }
      if (val == 1) {
        this.configFormList = this.formList.filter(form => form.configStatus)
      }
      if (val == 2) {
        this.configFormList = this.formList.filter(form => !form.configStatus)
      }
    },

    initDepart() {
      let userInfo = Vue.ls.get(USER_INFO)
      initDeptTree(userInfo.userId).then(res => {
        if (res.state) {
          this.departList = res.value
        }
      })
    },

    applyPermissionBatch() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请至少选择一行')
        return
      }
      this.$refs.permissionDialog.edit(this.selectedRowKeys)
    },

    applyPermission(row) {
      this.$refs.permissionDialog.edit([row])
    },

    refreshPermission(permissionForm) {
      this.$refs.table.clearSelection()
      //this.initData()
      this.formList.forEach(form => {
        permissionForm.formIds.forEach(formId => {
          if (form.formId == formId) {
            form.collaborateOrgName = permissionForm.collaborateOrgName
            form.responsibleOrgName = permissionForm.responsibleOrgName
          }
        })
      })
    },
    copyPermission() {
      this.$refs.copyPermissionDialog.show()
    },

    frontStep() {
      this.$emit('change', 1)
    },

    nextStep() {
      let forms = this.formList.filter(form => !form.responsibleOrgName)
      if (forms.length > 0) {
        this.$message.error('存在表单尚未配置负责部门，请检查!')
        return
      }
      this.$emit('change', 3)
    },

    back() {
      this.$emit('back')
    }
  }
}
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
.right-side {
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
