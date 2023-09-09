<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="always" class="app-card">
          <div slot="header" class="card-title">
            <span>组织架构</span>
            <span class="card-title-button">
              <el-button type="primary" @click="addDepart">添加组织</el-button>
            </span>
          </div>
          <el-row style="margin-bottom: 24px">
            <el-col :span="3"> <span style="line-height: 32px">部门名称</span></el-col>
            <el-col :span="21"> <el-input v-model="departFilter" placeholder="请输入部门名称搜索" @input="searchDepart" clearable /></el-col>
          </el-row>
          <depart-tree ref="departTree" :loading="loading" :departList="departList" @select="selectDepart" @edit="editDept" @del="delDept" />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-tabs type="border-card" ref="tabs">
          <el-tab-pane label="组织信息">
            <el-empty description="请选择部门查看详细信息" v-if="!selectDept.id" />
            <depart-info v-else :departId="selectDept.id" :isEdit="deptEdit" :users="userList" @refresh="refreshDept" />
          </el-tab-pane>
          <el-tab-pane label="人员信息">
            <el-empty description="请选择部门查看详细信息" v-if="!selectDept.id" />
            <depart-user v-else :roles="roleList" :depart="selectDept" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <add-depart-dialog ref="modalForm" @refresh="initDepart" :functionId="functionId" :teachingId="teachingId" />
  </div>
</template>

<script>
import { getUserList } from '@/api/system/user'
import AddDepartDialog from './components/add-depart-dialog'
import DepartTree from './components/depart-tree'
import { initDeptTree, delOrg } from '@/api/system/depart'
import { getRoleList } from '@/api/system/role'
import { USER_INFO } from '@/store/mutation-types'
import DepartInfo from './components/depart-info'
import DepartUser from './components/depart-user'
export default {
  name: 'DeptList',
  components: { DepartTree, AddDepartDialog, DepartInfo, DepartUser },
  data() {
    return {
      departFilter: '',
      departList: [],
      loading: false,
      selectDept: {},
      deptEdit: false,
      userList: [],
      roleList: []
    }
  },
  mounted() {
    this.initDepart()
    this.initRole()
    this.initUserList()
  },

  computed: {
    functionId() {
      if (this.departList.length > 0) {
        let functionDept = this.departList[0].children.find(dept => dept.name == '职能部门')
        if (functionDept) {
          return functionDept.id
        }
      }
      return ''
    },
    teachingId() {
      if (this.departList.length > 0) {
        let teachingDept = this.departList[0].children.find(dept => dept.name == '教学部门')
        if (teachingDept) {
          return teachingDept.id
        }
      }
      return ''
    }
  },

  methods: {
    initRole() {
      getRoleList({}).then(res => {
        if (res.state) {
          this.roleList = res.value.rows.filter(role => role.enabled == 1)
        }
      })
    },

    initDepart() {
      let userInfo = this.$ls.get(USER_INFO)
      this.loading = true
      initDeptTree(userInfo.userId)
        .then(res => {
          if (res.state) {
            this.departList = res.value
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    addDepart() {
      this.$refs.modalForm.add()
    },

    searchDepart() {
      this.$refs.departTree.filter(this.departFilter)
    },

    selectDepart(val) {
      this.selectDept = val
      this.deptEdit = false
    },

    editDept(val) {
      this.selectDept = val
      this.deptEdit = true
    },

    initUserList() {
      getUserList({}).then(res => {
        if (res.state) {
          this.userList = res.value.rows
        }
      })
    },

    delDept(val) {
      let params = 'id=' + val.id
      this.loading = true
      delOrg(params)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.initDepart()
            this.selectDept = {}
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    refreshDept(value) {
      let { id, status } = value
      this.selectDept = { id, status }
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-tabs__item {
  height: 46px;
  line-height: 46px;
  font-size: 16px;
  width: 150px;
  text-align: center;
}
</style>
