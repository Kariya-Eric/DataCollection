<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="角色名称">
              <a-input placeholder="请输入角色名称" v-model="queryParam.name" allowClear />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="角色状态">
              <a-select placeholder="请选择角色状态" v-model="queryParam.enabled" allowClear>
                <a-select-option :value="1">启用</a-select-option>
                <a-select-option :value="0">禁用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <span class="table-page-search-buttons">
              <a-button type="primary" icon="search" @click="searchQuery">搜索</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>角色管理</span>
      <div class="table-operator-button">
        <a-popconfirm title="确认删除吗？" @confirm="batchDel" v-if="selectedRowKeys.length > 0">
          <a-button type="danger">批量删除</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="handleAdd('新增角色')">添加角色</a-button>
      </div>
    </div>

    <div>
      <a-table
        bordered
        rowKey="id"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record, '修改角色')">编辑</a>
          <a-divider type="vertical" />
          <a @click="showPermission(record)">授权</a>
        </template>
      </a-table>
    </div>
    <role-modal ref="modalForm" @ok="loadData" />
    <permission-drawer ref="permissionDrawer" />
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import RoleModal from './components/role-modal'
import PermissionDrawer from './components/permission-drawer.vue'
export default {
  mixins: [DataCollectionListMixin],
  components: { RoleModal, PermissionDrawer },
  data() {
    return {
      url: {
        list: '/uc/api/role/getRolePage',
        deleteBatch: '/uc/api/role/deleteRoleByIds'
      },
      columns: [
        { dataIndex: 'name', title: '角色名称', align: 'center' },
        { dataIndex: 'code', title: '角色编码', align: 'center' },
        { dataIndex: 'enabled', title: '状态', align: 'center' },
        { dataIndex: 'updateTime', title: '更新时间', align: 'center' },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created() {
    this.loadData(1)
  },
  methods: {
    showPermission(row) {
      this.$refs.permissionDrawer.show(row)
    }
  }
}
</script>

<style scoped lang="less"></style>
