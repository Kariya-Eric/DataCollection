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
        <a-button type="danger">批量解绑</a-button>
        <a-button type="primary">绑定人员</a-button>
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
        <template slot="action" slot-scope="text, record">
          <a>查看</a>
          <a-divider type="vertical" v-if="isEdit" />
          <a v-if="isEdit">解绑关系</a>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
export default {
  name: 'SubjectUser',
  props: ['subject', 'roles', 'isEdit'],
  mixins: [DataCollectionListMixin],
  data() {
    return {
      columns: [
        { dataIndex: 'account', title: '账号', align: 'center' },
        { dataIndex: 'name', title: '姓名', align: 'center' },
        { dataIndex: 'orgName', title: '所属部门', align: 'center' },
        { dataIndex: 'account1', title: '所属专业', align: 'center' },
        { dataIndex: 'roleName', title: '角色', align: 'center' },
        { dataIndex: 'status', title: '状态', align: 'center' },
        { dataIndex: 'action', title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  }
}
</script>

<style lang="less" scoped></style>
