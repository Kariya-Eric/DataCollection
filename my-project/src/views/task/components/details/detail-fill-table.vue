<template>
  <div>
    <a-table
      bordered
      rowKey="id"
      :dataSource="handlerData(dataSource)"
      :pagination="ipagination"
      :loading="loading"
      :columns="columns"
      :rowClassName="tableRowClassName"
      @change="handleTableChange"
      :expandedRowKeys="expandedKeys"
    >
      <template slot="expandIcon" slot-scope="props">
        <span style="margin-left: 12px; margin-right: 12px; font-size: 10px">
          <a-icon type="down" v-if="props.expanded" @click="() => props.onExpand()" />
          <a-icon type="right" v-if="!props.expanded && props.record.children.length > 0" @click="() => props.onExpand()" />
        </span>
      </template>
      <template slot="name" slot-scope="text, record">
        <span>{{ record.name }}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        {{ caculateStatus(record.status).name }}
      </template>
      <template slot="action" slot-scope="record">
        <span class="action-span">
          <a v-if="judgeApply(record, currentUser, roleList)" @click="showForm(record)">填报</a>
          <a-popconfirm v-if="judgeRedo(record, currentUser, roleList)" @confirm="redoForm(record.id)" title="确认要撤回该表吗">
            <a>撤回</a>
          </a-popconfirm>
          <a v-if="judgeShow(record, currentUser, roleList)" @click="showForm(record)">查看</a>
        </span>
      </template>
    </a-table>
    <form-drawer ref="formDrawer" @refresh="loadData" />
  </div>
</template>

<script>
const listUrl = '/uc/api/taskFormDetail/list/'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { handlerData } from './utils'
import { judgeApply, judgeRedo, judgeShow } from './auth'
import { USER_INFO, ROLE_LIST } from '@/store/mutation-types'
import { taskFormDetail, recallForm } from '@/api/task'
import storage from 'store'
import FormDrawer from './form-drawer'
export default {
  name: 'DetailApproveTable',
  mixins: [DataCollectionListMixin],
  components: { FormDrawer },
  props: ['taskId'],
  data() {
    return {
      handlerData,
      judgeShow,
      judgeApply,
      judgeRedo,
      currentUser: storage.get(USER_INFO),
      roleList: storage.get(ROLE_LIST),
      url: {
        list: ''
      },
      expandedKeys: [],
      columns: [
        { title: '表单名称', scopedSlots: { customRender: 'name' }, align: 'center' },
        { dataIndex: 'type', title: '类型', align: 'center' },
        { dataIndex: 'responsibleOrgName', title: '负责部门', align: 'center' },
        { dataIndex: 'responsibleUserName', title: '审核人', align: 'center' },
        { title: '状态', align: 'center', scopedSlots: { customRender: 'status' } },
        { title: '统计截止时间', align: 'center', scopedSlots: { customRender: 'statisticsEndTime' } },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },

  mounted() {
    this.refreshData(1)
  },

  methods: {
    refreshData(args) {
      this.url.list = `${listUrl}?taskId=${this.taskId}&type=FILL`
      this.loadData(args)
    },

    customMethod() {
      this.setExpandedKeys(this.dataSource)
    },

    setExpandedKeys(dataSource) {
      dataSource.forEach(ele => {
        if (ele.children && ele.children.length > 0) {
          this.expandedKeys.push(ele.id)
          this.setExpandedKeys(ele.children)
        }
      })
    },

    caculateStatus(status) {
      if (status == 0) {
        return { status: 2, name: '待提交' }
      } else if (status == 1) {
        return { status: 1, name: '审核中' }
      } else if (status == 2) {
        return { status: 3, name: '审核通过' }
      } else if (status == 3) {
        return { status: 0, name: '退回修改' }
      } else {
        return { status: 2, name: '待配置人员' }
      }
    },

    tableRowClassName(record) {
      if (record.type == '子表') {
        return 'child-row'
      }
      return ''
    },

    redoForm(id) {
      this.loading = true
      recallForm(id)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.refreshData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    showForm(row) {
      this.loading = true
      taskFormDetail(row.id)
        .then(res => {
          if (res.state) {
            const formProperties = JSON.parse(res.value.formProperties)
            const fields = JSON.parse(res.value.componentProperties)
            const data = res.value.formData == null ? null : JSON.parse(res.value.formData)
            let formData = { ...formProperties, fields, data }
            this.$refs.formDrawer.show(formData, res.value.formName, res.value.id, res.value.status, row)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style lang="less">
.child-row {
  background: #f2f7ff;
}
.action-span {
  a {
    margin-right: 12px;
  }
}
</style>
