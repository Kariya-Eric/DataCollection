<template>
  <div class="container" style="margin: 12px 12px 0px">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form :layout="inline" ref="userForm" :model="queryParam">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="用户名">
                <a-input
                  v-model="queryParam.queryWord"
                  placeholder="输入用户名模糊查询"
                />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="部门ID">
                <a-input v-model="queryParam.orgId" placeholder="改成下拉框" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-space>
                <a-button type="primary" @click="search">
                  <icon-search />查询
                </a-button>
                <a-button type="primary" @click="searchReset">
                  <icon-delete /> 重置
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 操作区域 -->
      <div class="table-operator" style="border-top: 5px">
        <a-space>
          <a-button type="primary" @click="addUser">
            <icon-plus />添加用户
          </a-button>
        </a-space>
      </div>
      <!-- table区域 -->
      <div>
        <a-table
          :columns="columns"
          :data="dataSource"
          :pagination="ipagination"
          :bordered="{ cell: true }"
        >
          <template #action="{ record }">
            <a href="javascript:;">详情</a>
            <a-divider direction="vertical" />
            <a href="javascript:;" @click="editUser(record)">编辑</a>
            <a-divider direction="vertical" />
            <a href="javascript:;">重置密码</a>
          </template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script>
import { AddUserDrawer } from './components/AddUserDrawer.vue';
import { DataCollectionMixin } from '@/mixins/DataCollectionMixin';

export default {
  name: 'SystemUser',
  components: {
    AddUserDrawer,
  },
  mixins: [DataCollectionMixin],
  data() {
    return {
      columns: [
        {
          title: '姓名',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '帐号',
          align: 'center',
          dataIndex: 'account',
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'name',
        },
        {
          title: '所属部门',
          align: 'center',
          dataIndex: 'orgName',
        },
        {
          title: '邮箱地址',
          align: 'center',
          dataIndex: 'email',
        },
        {
          title: '手机号',
          align: 'center',
          dataIndex: 'mobile',
        },
        {
          title: '操作',
          align: 'center',
          slotName: 'action',
        },
      ],
    };
  },
  methods: {
    editUser(record) {
      console.log(record);
    },

    addUser() {},
  },
};
</script>

<style>
</style>