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
      <div class="list-header-button">
        <el-popconfirm title="确认删除吗？" @confirm="delUserBatch" v-if="selectedRowKeys.length > 0">
          <el-button type="danger" slot="reference">批量解绑</el-button>
        </el-popconfirm>
        <el-button style="margin-left: 12px" type="primary" @click="addUser"><svg-icon icon-class="新建" />绑定人员</el-button>
      </div>
    </div>

    <dc-table
      v-loading="loading"
      @selection-change="onSelectChange"
      :data="dataSource"
      :columns="columns"
      :pagination="ipagination"
      selection="selection"
      @change="initData"
    >
      <template slot="status" slot-scope="{ row }">
        <dc-status status="3" title="启用" v-if="row.status == 1" />
        <dc-status status="2" title="禁用" v-else />
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-popconfirm @confirm="delUser(row.id)" title="确定解绑该用户吗？">
          <a slot="reference">解绑关系</a>
        </el-popconfirm>
      </template>
    </dc-table>
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
export default {
  mixins: [DataCollectionMixin],
  name: 'SubjectUser',
  props: ['roles'],
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
  watch: {
    roles: {
      immediate: true,
      handler(newVal) {
        this.searchItems[0].options = newVal
      }
    }
  },
  methods: {
    initData() {},
    addUser() {},
    delUserBatch() {},
    delUser() {}
  }
}
</script>

<style scoped lang="scss">
.form {
  padding: 12px;
}
</style>
