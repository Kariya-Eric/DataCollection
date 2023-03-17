<template>
  <div class="container" style="margin: 12px 12px 0px">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form
          :layout="inline"
          ref="userForm"
          :model="queryParam"
          @keyup.enter="searchQuery"
        >
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
                <a-button type="primary" @click="searchQuery">
                  <template #icon>
                    <icon-search />
                  </template>
                  查询
                </a-button>
                <a-button type="primary" @click="searchReset">
                  <template #icon>
                    <icon-delete />
                  </template>
                  重置
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
            <template #icon>
              <icon-plus />
            </template>
            添加用户
          </a-button>
          <a-popconfirm
            content="确定要删除以下用户吗？"
            @ok="delBatch"
            type="warning"
          >
            <a-button
              v-if="selectedRowKeys.length > 0"
              status="danger"
              type="primary"
            >
              <template #icon>
                <icon-delete />
              </template>
              批量删除</a-button
            >
          </a-popconfirm>
        </a-space>
      </div>

      <!-- table区域 -->
      <div>
        <a-table
          row-key="id"
          :columns="columns"
          :data="dataSource"
          :loading="loading"
          :pagination="ipagination"
          :bordered="false"
          :row-selection="rowSelectionBox"
          @select="onSelectChange"
          @select-all="onSelectAll"
        >
          <template #status="{ record }">
            {{ record.status === 1 ? '启用' : '禁用' }}
          </template>
          <template #action="{ record }">
            <a href="javascript:;">详情</a>
            <a-divider direction="vertical" />
            <a href="javascript:;" @click="editUser(record)">编辑</a>
            <a-divider direction="vertical" />
            <a href="javascript:;" @click="resetPwd(record)">重置密码</a>
          </template>
        </a-table>
      </div>
    </a-card>

    <add-user-modal ref="addUserModal" @refresh="loadData" />
    <reset-pwd-modal ref="resetPwdModal" />
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixin';
import { deleteBatch } from '@/api/system/user';
import AddUserModal from './components/AddUserModal.vue';
import ResetPwdModal from './components/ResetPwdModal.vue';

export default {
  name: 'SystemUser',
  components: {
    AddUserModal,
    ResetPwdModal,
  },
  mixins: [DataCollectionMixin],
  data() {
    return {
      url: {
        list: '/uc/api/user/getUserPage',
      },
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
          slotName: 'status',
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
      this.$refs.addUserModal.show(record.id);
    },

    addUser() {
      this.$refs.addUserModal.show();
    },

    resetPwd(record) {
      this.$refs.resetPwdModal.show(record.id, record.account);
    },

    delBatch() {
      const ids = this.selectedRowKeys.join(',');
      this.loading = true;
      deleteBatch({ ids })
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
          } else {
            this.$message.warning(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
          this.loadData();
        });
    },
  },
};
</script>

<style></style>
