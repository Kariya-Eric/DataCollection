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
      <template slot="action" slot-scope="record">
        <a v-if="judgeApply(record, currentUser)" @click="showForm(record)">填报</a>
        <a-divider type="vertical" v-if="judgeApply(record, currentUser) && judgeRedo(record, currentUser)" />
        <a-popconfirm v-if="judgeRedo(record, currentUser)" @confirm="redoForm(scope.row)" title="确认要撤回该表吗">
          <a>撤回</a>
        </a-popconfirm>
        <a-divider type="vertical" v-if="judgeShow(record, currentUser) && judgeRedo(record, currentUser)" />
        <a v-if="judgeShow(record, currentUser)">查看</a>
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
import { taskFormDetail, recallForm } from '@/api/task'
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
            this.$refs.formDrawer.show(formData, res.value.formName, res.value.id, res.value.status)
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
</style>
