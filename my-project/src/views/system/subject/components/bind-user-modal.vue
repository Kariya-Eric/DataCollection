<template>
  <a-modal v-if="visible" title="绑定人员" :confirmLoading="loading" :visible="visible" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="70%">
    <a-spin :spinning="loading">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="12">
              <a-form-item label="角色">
                <a-select v-model="queryParam.roleId" placeholder="请选择角色" allowClear>
                  <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="12">
              <a-form-item>
                <a-input v-model="queryParam.queryWord" placeholder="请输入姓名,帐号,手机" allowClear> </a-input>
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="12">
              <span class="table-page-search-buttons">
                <a-button type="primary" icon="search" @click="searchQuery">搜索</a-button>
                <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-row :gutter="24">
        <a-col :span="18">
          <a-table
            bordered
            :rowKey="record => record.id + ',' + record.name"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columns"
            @change="handleTableChange"
          >
            <template slot="status" slot-scope="text, record">
              <dc-status v-if="record.status == 1" name="启用" color="blue" />
              <dc-status v-else name="禁用" color="grey" />
            </template>
          </a-table>
        </a-col>
        <a-col :span="6">
          <div class="right-div">
            <a-empty v-if="selectedRowKeys.length == 0">
              <span slot="description">请选择一条数据用于绑定</span>
            </a-empty>
            <div v-else>
              <a-tag v-for="(item, index) in selectedRowKeys" :key="index" class="user-tag" closable @close="e => closeTag(item, e)">
                {{ item.split(',')[1] }}
              </a-tag>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import { getUserList, updateUserSubjectByIds } from '@/api/system/user'
export default {
  name: 'BindUserModal',
  props: ['roleList', 'subject'],
  data() {
    return {
      visible: false,
      loading: false,
      dataSource: [],
      queryParam: {},
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + '共' + total + '条'
        },
        showQuickJumper: true,
        showSizeJumper: true,
        total: 0
      },
      selectedRowKeys: [],
      columns: [
        { dataIndex: 'account', title: '账号', align: 'center' },
        { dataIndex: 'name', title: '姓名', align: 'center' },
        { dataIndex: 'orgName', title: '所属部门', align: 'center' },
        { dataIndex: 'roleName', title: '角色', align: 'center' },
        { dataIndex: 'email', title: '邮箱', align: 'center' },
        { dataIndex: 'mobile', title: '手机号', align: 'center' },
        { title: '状态', align: 'center', scopedSlots: { customRender: 'status' } }
      ]
    }
  },
  methods: {
    show() {
      this.getUserList(1)
      this.visible = true
    },

    handleCancel() {
      this.visible = false
      this.onClearSelected()
    },

    handleOk() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请至少选择一条数据！')
        return
      }
      // 后端不给个批量接口，逆天
      let userIds = this.selectedRowKeys.map(rowKey => rowKey.split(',')[0]).join(',')
      this.loading = true
      updateUserSubjectByIds({ userIds, subjectId: this.subject.id })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.handleCancel()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    getQueryParams() {
      let pageBean = {
        page: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        showTotal: true
      }
      return {
        params: Object.assign(this.queryParam),
        pageBean
      }
    },

    getUserList(arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      let params = this.getQueryParams()
      getUserList(params)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value.rows || res.value
            if (res.value.total) {
              this.ipagination.total = res.value.total
            } else {
              this.ipagination.total = 0
            }
          }
        })
        .finally(() => (this.loading = false))
    },

    searchQuery() {
      this.onClearSelected()
      this.getUserList(1)
    },

    searchReset() {
      this.queryParam = {}
      this.onClearSelected()
      this.getUserList(1)
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    onClearSelected() {
      this.selectedRowKeys = []
    },

    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.getUserList()
    },

    closeTag(key, e) {
      e.preventDefault()
      this.selectedRowKeys = this.selectedRowKeys.filter(item => item != key)
    }
  }
}
</script>

<style lang="less" scoped>
.right-div {
  height: calc(80vh - 150px);
  padding-left: 12px;
  border-left: 1px solid #e8e8e8;
}
.user-tag {
  margin-bottom: 12px;
  height: 32px !important;
  line-height: 32px !important;
  padding: 0 12px;
  background: #2f68bd !important;
  border: 1px solid #2f68bd !important;
  color: #fff;
  font-size: 14px;
  /deep/.anticon {
    color: #fff;
    font-size: 14px;
  }
}
</style>
