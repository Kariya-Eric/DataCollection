<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="always" class="app-card">
          <div slot="header" class="card-title">
            <span>专业架构</span>
            <span class="card-title-button">
              <el-button type="primary" @click="$refs.subjectDialog.add()">添加专业</el-button>
            </span>
          </div>
          <el-row style="margin-bottom: 24px">
            <el-col :span="3"> <span style="line-height: 32px">专业名称</span></el-col>
            <el-col :span="21">
              <el-input v-model="subjectFilter" placeholder="请输入专业名称搜索" @input="searchSubject" clearable />
            </el-col>
          </el-row>
          <subject-tree ref="subjectTree" :loading="loading" :subjectList="subjectList" @select="selectsubject" @edit="editSubject" @del="delSubject" />
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-tabs type="border-card" ref="tabs">
          <el-tab-pane label="专业信息">
            <el-empty description="请选择专业查看详细信息" v-if="!selectSubject.id" />
            <subject-info v-else :subject="selectSubject" :orgs="selectOrgs" :isEdit="subjectEdit" @refresh="refreshSubject" />
          </el-tab-pane>
          <el-tab-pane label="人员信息">
            <el-empty description="请选择专业查看详细信息" v-if="!selectSubject.id" />
            <subject-user v-else :roles="roleList" />
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <add-subject-dialog :departList="departList" ref="subjectDialog" @refresh="initSubject" />
  </div>
</template>

<script>
import { getUserList } from '@/api/system/user'
import { getRoleList } from '@/api/system/role'
import { getSubjectTree, delSubject } from '@/api/system/subject'
import SubjectTree from './components/subject-tree'
import SubjectInfo from './components/subject-info'
import SubjectUser from './components/subject-user'
import AddSubjectDialog from './components/add-subject-dialog'
import { initDeptTree } from '@/api/system/depart'
import { USER_INFO } from '@/store/mutation-types'

export default {
  name: 'SubjectList',
  components: { SubjectTree, SubjectInfo, SubjectUser, AddSubjectDialog },
  data() {
    return {
      loading: false,
      subjectFilter: '',
      selectSubject: {},
      subjectList: [],
      selectOrgs: [],
      subjectEdit: false,
      userList: [],
      roleList: [],
      departList: []
    }
  },

  mounted() {
    this.initSubject()
    this.initRole()
    this.initUserList()
    this.initDepart()
  },
  methods: {
    initSubject() {
      this.loading = true
      getSubjectTree()
        .then(res => {
          if (res.state) {
            this.subjectList = res.value
          }
        })
        .finally(() => (this.loading = false))
    },

    searchSubject() {
      this.$refs.subjectTree.filter(this.subjectFilter)
    },

    initDepart() {
      let userInfo = this.$ls.get(USER_INFO)
      this.loading = true
      initDeptTree(userInfo.userId)
        .then(res => {
          if (res.state) {
            this.departList = res.value
          }
        })
        .finally(() => (this.loading = false))
    },

    selectsubject(subject, orgs) {
      this.selectSubject = subject
      this.selectOrgs = orgs
      this.subjectEdit = false
    },

    editSubject(subject, orgs) {
      this.selectSubject = subject
      this.selectOrgs = orgs
      this.subjectEdit = true
    },

    delSubject(id) {
      let params = 'id=' + id
      this.loading = true
      delSubject(params)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.initSubject()
            this.selectSubject = {}
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    refreshSubject(val) {
      this.initSubject()
      this.$refs.subjectTree.setCurrentNode(val)
    },

    initRole() {
      getRoleList({}).then(res => {
        if (res.state) {
          this.roleList = res.value.rows.filter(role => role.enabled == 1)
        }
      })
    },

    initUserList() {
      getUserList({}).then(res => {
        if (res.state) {
          this.userList = res.value.rows
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.el-tabs__item {
  height: 46px;
  line-height: 46px;
  font-size: 16px;
  width: 150px;
  text-align: center;
}
</style>
