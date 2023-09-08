<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <dc-search label-width="70px" :form="queryParam" :items="searchItems" okBtn="搜索" cancelBtn="重置" @submit="searchQuery" @cancel="searchReset" />
      <!-- Query End -->

      <div class="list-header">
        <span>角色管理</span>
        <div class="list-header-button">
          <el-popconfirm v-if="selectedRowKeys.length > 0" @confirm="delBatch" title="确认批量删除选中角色吗？">
            <el-button type="danger" slot="reference">批量删除</el-button>
          </el-popconfirm>
          <el-button style="margin-left: 12px" @click="handleAdd" type="primary"><svg-icon icon-class="新建" />添加角色</el-button>
        </div>
      </div>

      <!-- Table Start -->
      <dc-table
        v-loading="loading"
        @selection-change="onSelectChange"
        :data="dataSource"
        :columns="columns"
        :pagination="ipagination"
        selection="selection"
        @change="loadData"
      >
        <template slot="enabled" slot-scope="scope">
          <dc-status status="3" title="启用" v-if="scope.row.enabled == 1" />
          <dc-status status="2" title="禁用" v-else />
        </template>
        <template slot="action" slot-scope="scope">
          <a href="javascript:;" @click="handleEdit(scope.row)">编辑</a>
          <el-divider direction="vertical" />
          <a href="javascript:;">授权</a>
        </template>
      </dc-table>
    </el-card>

    <role-dialog ref="modalForm" name="角色" @refresh="loadData" />
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
import RoleDialog from './components/role-dialog'
export default {
  name: 'RoleList',
  mixins: [DataCollectionMixin],
  components: { RoleDialog },
  data() {
    return {
      url: {
        list: '/uc/api/role/getRolePage',
        delBatch: '/uc/api/role/deleteRoleByIds'
      },
      searchItems: [
        { type: 'input', label: '角色名称', prop: 'name' },
        {
          type: 'select',
          label: '角色状态',
          prop: 'enabled',
          options: [
            { label: '启用', value: 1 },
            { label: '禁用', value: 0 }
          ]
        }
      ],
      columns: [
        { label: '角色名称', prop: 'name' },
        { label: '角色编码', prop: 'code' },
        { label: '状态', slot: 'enabled' },
        { label: '更新时间', prop: 'updateTime' },
        { label: '操作', slot: 'action' }
      ]
    }
  },

  created() {
    this.loadData(1)
  },

  methods: {}
}
</script>

<style scoped lang="scss"></style>
