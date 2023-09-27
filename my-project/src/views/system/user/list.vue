<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="3" :sm="12">
            <a-form-item label="部门">
              <a-select v-model="queryParam.orgId" placeholder="请选择部门"> </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <a-form-item label="角色">
              <a-select v-model="queryParam.roleId" placeholder="请选择角色"> </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <a-form-item label="专业">
              <a-select v-model="queryParam.major" placeholder="请选择专业"> </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <a-form-item>
              <a-input v-model="queryParam.queryWord" placeholder="请输入姓名,帐号,手机"> </a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <span class="table-page-search-buttons">
              <a-button type="primary" icon="search">搜索</a-button>
              <a-button type="primary" icon="reload">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>用户管理</span>
      <div class="table-operator-button">
        <a-popconfirm title="确认删除吗？" @confirm="batchDel" v-if="selectedRowKeys.length > 0">
          <a-button type="danger">批量删除</a-button>
        </a-popconfirm>
        <a-button type="primary">添加用户</a-button>
        <a-button type="primary">导入</a-button>
        <a-button type="primary">导出</a-button>
        <a href="javascript:;">下载导入模板</a>
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
          <a>查看</a>
          <a-divider type="vertical" />
          <a>编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除吗？" @confirm="handleDelete(record.id)"> <a>删除</a></a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="确定重置该用户的密码吗？"> <a>重置密码</a></a-popconfirm>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
export default {
  mixins: [DataCollectionListMixin],
  data() {
    return {
      url: {
        list: '/uc/api/user/getUserPage'
      },
      columns: [
        { dataIndex: 'account', title: '账号', align: 'center' },
        { dataIndex: 'name', title: '姓名', align: 'center' },
        { dataIndex: 'orgName', title: '所属部门', align: 'center' },
        { dataIndex: 'account1', title: '所属专业', align: 'center' },
        { dataIndex: 'roleName', title: '角色', align: 'center' },
        { dataIndex: 'email', title: '邮箱', align: 'center' },
        { dataIndex: 'mobile', title: '手机号', align: 'center' },
        { dataIndex: 'status', title: '状态', align: 'center' },
        { dataIndex: 'action', title: '操作', width: 250, align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created() {
    this.loadData(1)
  },
  methods: {}
}
</script>

<style scoped lang="less"></style>
