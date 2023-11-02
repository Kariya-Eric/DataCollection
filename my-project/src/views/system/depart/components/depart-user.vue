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
              <a-input v-model="queryParam.keyword" allowClear placeholder="请输入姓名" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="12">
            <span class="table-page-search-buttons">
              <a-button type="primary" icon="search" @click="searchQuery">搜索</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>人员列表</span>
      <div class="table-operator-button" v-if="isEdit">
        <a-popconfirm title="确认删除吗？" @confirm="batchDel" v-if="selectedRowKeys.length > 0">
          <a-button type="danger"><dc-icon type="icon-dc_empty" />批量删除</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="handleAdd('添加用户')"><dc-icon type="icon-dc_new" />添加用户</a-button>
      </div>
    </div>

    <div>
      <a-table
        bordered
        rowKey="id"
        :dataSource="dataSource"
        :pagination="false"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text, record">
          <dc-status v-if="record.status == 1" name="启用" color="blue" />
          <dc-status v-else name="禁用" color="grey" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record, '用户详情')">查看</a>
          <a-divider type="vertical" v-if="isEdit" />
          <a v-if="isEdit" @click="handleEdit(record, '编辑用户')">编辑</a>
          <a-divider type="vertical" v-if="isEdit" />
          <a-popconfirm title="确认删除吗？" @confirm="handleDelete(record.id)" v-if="isEdit"> <a>删除</a></a-popconfirm>
        </template>
      </a-table>
    </div>

    <user-modal ref="modalForm" :depart="orgId" :role="roles" @ok="loadData" :departs="departs[0].children" />
  </div>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import UserModal from '../../user/components/user-modal.vue'
import { getOrgUser } from '@/api/system/depart'
import { deleteUser } from '@/api/system/user'
export default {
  name: 'DepartUser',
  mixins: [DataCollectionListMixin],
  components: { UserModal },
  props: ['roles', 'orgId', 'isEdit', 'departs'],
  data() {
    return {
      url: {
        deleteBatch: '/uc/api/user/deleteUserByIds'
      },
      columns: [
        { dataIndex: 'account', title: '账号', align: 'center' },
        { dataIndex: 'name', title: '姓名', align: 'center' },
        { dataIndex: 'orgName', title: '所属部门', align: 'center' },
        { dataIndex: 'subjectName', title: '所属专业', align: 'center' },
        { dataIndex: 'roleName', title: '角色', align: 'center' },
        { title: '状态', align: 'center', scopedSlots: { customRender: 'status' } },
        { dataIndex: 'action', title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  watch: {
    orgId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.loadData()
        }
      }
    },
    dataSource(newVal) {
      this.$emit('refresh')
    }
  },
  methods: {
    loadData() {
      let param = { roleId: this.queryParam.roleId ? this.queryParam.roleId : '', keyword: this.queryParam.keyword ? this.queryParam.keyword : '', orgId: this.orgId }
      this.loading = true
      getOrgUser(param)
        .then(res => (this.dataSource = res))
        .finally(() => {
          this.onClearSelected()
          this.loading = false
        })
    },

    handleDelete(id) {
      let that = this
      that.loading = true
      deleteUser({ ids: id })
        .then(res => {
          if (res.state) {
            that.$message.success(res.message)
            that.loadData()
          } else {
            that.$message.error(res.message)
          }
        })
        .finally(() => (that.loading = false))
    }
  }
}
</script>

<style scoped lang="less"></style>
