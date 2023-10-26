<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="12">
            <a-form-item label="角色">
              <a-select v-model="queryParam.roleId" placeholder="请选择角色" allowClear>
                <a-select-option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.queryWord" allowClear placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <span class="table-page-search-buttons">
              <a-button type="primary" icon="search" @click="getUser">搜索</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>人员列表</span>
      <div class="table-operator-button" v-if="isEdit">
        <a-popconfirm title="确认要解绑以下用户吗？" v-if="selectedRowKeys.length > 0" @confirm="batchUnBind"> <a-button type="danger">批量解绑</a-button></a-popconfirm>
        <a-button type="primary" @click="$refs.bindUserModal.show()">绑定人员</a-button>
      </div>
    </div>

    <bind-user-modal ref="bindUserModal" :roleList="roles" :subject="subject" @refresh="getUser()" />

    <div>
      <a-table
        bordered
        rowKey="id"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
      >
        <template slot="status" slot-scope="text, record">
          <dc-status v-if="record.status == 1" name="启用" color="blue" />
          <dc-status v-else name="禁用" color="grey" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a-popconfirm title="确认要解绑该用户吗？" @confirm="unBindUser(record)">
            <a>解绑关系</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import BindUserModal from './bind-user-modal.vue'
import { updateUserSubjectByIds } from '@/api/system/user'
export default {
  name: 'SubjectUser',
  components: { BindUserModal },
  props: ['subject', 'roles', 'isEdit', 'users'],
  data() {
    return {
      queryParam: {},
      dataSource: this.users.filter(user => user.subjectId == this.subject.id),
      selectedRowKeys: [],
      loading: false,
      columns: []
    }
  },
  watch: {
    users(newVal) {
      this.dataSource = newVal.filter(user => user.subjectId == this.subject.id)
      this.loading = false
    },
    isEdit: {
      handler(newVal) {
        if (newVal) {
          this.columns = [
            { dataIndex: 'account', title: '账号', align: 'center', ellipsis: true },
            { dataIndex: 'name', title: '姓名', align: 'center', ellipsis: true },
            { dataIndex: 'orgName', title: '所属部门', align: 'center', ellipsis: true },
            { dataIndex: 'roleName', title: '角色', align: 'center', ellipsis: true },
            { title: '状态', align: 'center', scopedSlots: { customRender: 'status', ellipsis: true } },
            { dataIndex: 'action', title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
          ]
        } else {
          this.columns = [
            { dataIndex: 'account', title: '账号', align: 'center', ellipsis: true },
            { dataIndex: 'name', title: '姓名', align: 'center', ellipsis: true },
            { dataIndex: 'orgName', title: '所属部门', align: 'center', ellipsis: true },
            { dataIndex: 'roleName', title: '角色', align: 'center', ellipsis: true },
            { title: '状态', align: 'center', scopedSlots: { customRender: 'status' }, ellipsis: true }
          ]
        }
      },
      immediate: true
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    onClearSelected() {
      this.selectedRowKeys = []
    },

    searchReset() {
      this.queryParam = {}
      this.getUser()
    },

    getUser() {
      this.loading = true
      let searchParam = { params: Object.assign(this.queryParam) }
      this.$emit('refresh', searchParam)
    },

    unBindUser(user) {
      updateUserSubjectByIds({ userIds: user.id, subjectId: '' }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.getUser()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    batchUnBind() {
      updateUserSubjectByIds({ userIds: this.selectedRowKeys.join(','), subjectId: '' }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.getUser()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
