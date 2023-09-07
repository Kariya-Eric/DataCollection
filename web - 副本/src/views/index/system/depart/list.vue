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
          <el-form class="header-form" label-width="80px">
            <el-form-item label="部门名称">
              <el-input v-model="departFilter" placeholder="请输入部门名称" @input="searchDepart" clearable />
            </el-form-item>
          </el-form>
          <depart-tree ref="departTree" :loading="loading" :departList="departList" />
        </el-card>
      </el-col>
      <el-col :span="16"></el-col>
    </el-row>
    <add-depart-dialog ref="modalForm" @refresh="initDepart" :functionId="functionId" :teachingId="teachingId" />
  </div>
</template>

<script>
import AddDepartDialog from './components/add-depart-dialog'
import DepartTree from './components/depart-tree'
import { initDeptTree, delOrg } from '@/api/system/depart'
import { USER_INFO } from '@/store/mutation-types'
export default {
  name: 'DeptList',
  components: { DepartTree, AddDepartDialog },
  data() {
    return {
      departFilter: '',
      departList: [],
      loading: false
    }
  },
  mounted() {
    this.initDepart()
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
    }
  }
}
</script>

<style></style>
