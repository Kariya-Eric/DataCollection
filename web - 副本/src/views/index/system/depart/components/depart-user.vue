<template>
  <div class="form">
    <dc-search
      ref="searchForm"
      :form="queryParam"
      :items="searchItems"
      label-width="60px"
      okBtn="搜索"
      cancelBtn="重置"
      @submit="initData"
      @cancel="searchReset"
    />
    <div class="list-header">
      <span>人员列表</span>
      <div class="list-header-button" v-if="depart.status == 1">
        <el-popconfirm title="确认删除吗？" @confirm="delUserBatch" v-if="selectedRowKeys.length > 0">
          <el-button type="danger" slot="reference">批量删除</el-button>
        </el-popconfirm>
        <el-button style="margin-left: 12px" type="primary" @click="addUser"><svg-icon icon-class="新建" />添加用户</el-button>
      </div>
    </div>
    <dc-table v-loading="loading" @selection-change="onSelectChange" :data="dataSource" :columns="columns" :pagination="ipagination" selection="selection">
      <template slot="status" slot-scope="{ row }">
        <dc-status status="3" title="启用" v-if="row.status == 1" />
        <dc-status status="2" title="禁用" v-else />
      </template>
      <template slot="action" slot-scope="{ row }">
        <a @click="userInfo(row)">查看</a>
        <el-divider direction="vertical" />
        <a @click="editUser(row)">编辑</a>
        <el-divider direction="vertical" />
        <el-popconfirm @confirm="delUser(row.id)" title="确定删除该用户吗？">
          <a slot="reference">删除</a>
        </el-popconfirm>
      </template>
    </dc-table>
    <user-dialog ref="modalForm" :roles="roles" name="用户" @refresh="initData" />
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
import UserDialog from '../../user/components/user-dialog'
import { getOrgUser } from '@/api/system/depart'
import { delUserBatch } from '@/api/system/user'
export default {
  name: 'departUser',
  mixins: [DataCollectionMixin],
  components: { UserDialog },
  props: ['depart', 'roles'],
  watch: {
    depart: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.$nextTick(() => this.$refs.searchForm.submit())
        if (newVal.status == 0) {
          this.columns = this.columns.filter(col => col.slot != 'action')
        } else {
          let col = this.columns.find(col => col.slot == 'action')
          if (!col) {
            this.columns.push({ slot: 'action', label: '操作', width: '180px' })
          }
        }
      }
    },
    roles: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.searchItems.forEach(item => {
            if (item.prop === 'roleId') item.options = newVal
          })
        }
      }
    }
  },

  data() {
    return {
      queryParam: { roleId: '', keyword: '' },
      searchItems: [
        { label: '角色', prop: 'roleId', type: 'select', options: [] },
        { label: '姓名', prop: 'keyword', type: 'input' }
      ],
      columns: [
        { prop: 'account', label: '账号' },
        { prop: 'name', label: '姓名' },
        { prop: 'orgName', label: '所属部门' },
        { prop: 'account', label: '所属专业' },
        { prop: 'roleName', label: '角色' },
        { slot: 'status', label: '状态' },
        { slot: 'action', label: '操作', width: '180px' }
      ]
    }
  },

  methods: {
    searchReset() {
      this.queryParam = { roleId: '', keyword: '' }
      this.initData()
    },

    initData() {
      let param = { ...this.queryParam, orgId: this.depart.id }
      this.loading = true
      getOrgUser(param)
        .then(res => (this.dataSource = res))
        .finally(() => (this.loading = false))
    },

    addUser() {
      this.$refs.modalForm.userForm = { orgId: this.depart.id }
      this.$refs.modalForm.title = '新增' + this.$refs.modalForm.name
      this.$refs.modalForm.userFormItems = this.$refs.modalForm.userFormItems.filter(item => item.prop !== 'orgId')
      this.$refs.modalForm.add()
    },

    userInfo(record) {
      this.$refs.modalForm.userForm = { orgId: this.depart.id }
      this.$refs.modalForm.title = this.$refs.modalForm.name + '详情'
      this.$refs.modalForm.userFormItems = this.$refs.modalForm.userFormItems.filter(item => item.prop !== 'orgId')
      this.$refs.modalForm.info(record)
    },

    editUser(record) {
      this.$refs.modalForm.userForm = { orgId: this.depart.id }
      this.$refs.modalForm.title = '修改' + this.$refs.modalForm.name
      this.$refs.modalForm.userFormItems = this.$refs.modalForm.userFormItems.filter(item => item.prop !== 'orgId')
      this.$refs.modalForm.edit(record)
    },

    delUserBatch() {
      let ids = 'ids=' + this.selectedRowKeys.map(element => element.id).join(',')
      this.loading = true
      delUserBatch(ids)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.initData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = true
        })
    },

    delUser(id) {
      let ids = 'ids=' + id
      this.loading = true
      delUserBatch(ids)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.initData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = true
        })
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  padding: 12px;
}
</style>
