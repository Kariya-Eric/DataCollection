<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="3" :sm="12">
            <a-form-item label="部门">
              <a-select v-model="queryParam.orgId" placeholder="请选择部门" allowClear>
                <a-select-opt-group v-for="group in departList" :key="group.id">
                  <span slot="label">{{ group.name }}</span>
                  <a-select-option v-for="item in group.children.filter(i => i.status === 1)" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select-opt-group>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <a-form-item label="角色">
              <a-select v-model="queryParam.roleId" placeholder="请选择角色" allowClear>
                <a-select-option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <a-form-item label="专业">
              <a-select v-model="queryParam.major" placeholder="请选择专业" allowClear> </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
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

    <div class="table-operator">
      <span>用户管理</span>
      <div class="table-operator-button">
        <a-popconfirm title="确认删除吗？" @confirm="batchDel" v-if="selectedRowKeys.length > 0">
          <a-button type="danger"><dc-icon type="icon-empty" />批量删除</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="handleAdd('添加用户')"><dc-icon type="icon-new" />添加用户</a-button>
        <a-upload style="display: inline-block" :showUploadList="false" :beforeUpload="beforeUpload" :customRequest="handleUpload">
          <a-button type="primary"><dc-icon type="icon-export" /> 导入 </a-button>
        </a-upload>
        <a-button type="primary" @click="handleExport('用户导出')"><dc-icon type="icon-import" />导出</a-button>
        <a href="javascript:;" @click="downloadTemp">下载导入模板</a>
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
        <template slot="status" slot-scope="text, record">
          <dc-status v-if="record.status == 1" name="启用" color="blue" />
          <dc-status v-else name="禁用" color="grey" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleDetail(record, '用户详情')">查看</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record, '编辑用户')">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除吗？" @confirm="handleDelete(record.id)"> <a>删除</a></a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="确定重置该用户的密码吗？" @confirm="resetPassword(record.account)"> <a>重置密码</a></a-popconfirm>
        </template>
      </a-table>
    </div>
    <user-modal ref="modalForm" :depart="departList" :role="roleList" @ok="loadData" />
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import UserModal from './components/user-modal.vue'
import { getRoleList } from '@/api/system/role'
import { initDeptTree } from '@/api/system/depart'
import { USER_INFO } from '@/store/mutation-types'
import { resetPwd, downloadUserTemp, deleteUser, importUser } from '@/api/system/user'
import storage from 'store'
export default {
  mixins: [DataCollectionListMixin],
  components: { UserModal },
  data() {
    return {
      url: {
        list: '/uc/api/user/getUserPage',
        deleteBatch: '/uc/api/user/deleteUserByIds',
        exportUrl: '/uc/api/user/export'
      },
      columns: [
        { dataIndex: 'account', title: '账号', align: 'center' },
        { dataIndex: 'name', title: '姓名', align: 'center' },
        { dataIndex: 'orgName', title: '所属部门', align: 'center' },
        { dataIndex: 'account1', title: '所属专业', align: 'center' },
        { dataIndex: 'roleName', title: '角色', align: 'center' },
        { dataIndex: 'email', title: '邮箱', align: 'center' },
        { dataIndex: 'mobile', title: '手机号', align: 'center' },
        { title: '状态', align: 'center', scopedSlots: { customRender: 'status' } },
        { title: '操作', width: 250, align: 'center', scopedSlots: { customRender: 'action' } }
      ],
      roleList: [],
      departList: []
    }
  },
  created() {
    this.loadData(1)
    this.initDepart()
    this.initRole()
  },
  methods: {
    initDepart() {
      let userInfo = storage.get(USER_INFO)
      initDeptTree(userInfo.userId).then(res => {
        if (res.state) {
          this.departList = res.value[0].children
        }
      })
    },

    initRole() {
      getRoleList({}).then(res => {
        if (res.state) {
          this.roleList = res.value.rows.filter(role => role.enabled == 1)
        }
      })
    },

    resetPassword(account) {
      resetPwd({ account, newPwd: '123456' }).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    downloadTemp() {
      downloadUserTemp().then(data => {
        if (!data) {
          this.$message.warning('文件下载失败！')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), '模板.xlsx')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'appliaction/vnd.ms-excel' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', '模板.xlsx')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        }
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
    },

    handleUpload(info) {
      const formData = new FormData()
      formData.append('file', info.file)
      importUser(formData).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
