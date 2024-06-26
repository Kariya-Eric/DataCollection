<template>
  <div>
    <a-table
      bordered
      rowKey="id"
      :dataSource="handlerData(dataSource, currentUser, roleList)"
      :pagination="ipagination"
      :loading="loading"
      :columns="columns"
      :rowClassName="tableRowClassName"
      @change="handleTableChange"
      :expandedRowKeys="expandedKeys"
    >
      <template slot="expandIcon" slot-scope="props">
        <span class="array-span">
          <dc-icon type="icon-dc_arrow" v-if="props.expanded" @click="() => props.onExpand()" />
          <dc-icon type="icon-dc_arrow" class="right-icon" v-if="!props.expanded && props.record.children.length > 0" @click="() => props.onExpand()" />
        </span>
      </template>
      <template slot="name" slot-scope="text, record">
        <a-popover placement="right">
          <template slot="content">
            <div><dc-icon type="icon-dc_form_table" :style="{ color: '#2B9E77' }" /><span style="margin-left: 8px">固定表单</span></div>
            <div style="margin-top: 8px"><dc-icon type="icon-dc_form_table" :style="{ color: '#2F68BD' }" /><span style="margin-left: 8px">浮动表单</span></div>
          </template>
          <dc-icon type="icon-dc_form_table" v-if="record.name" :style="{ 'font-size': '16px', color: record.formType === '固定表单' ? '#2B9E77' : '#2F68BD' }" />
        </a-popover>
        <span>{{ record.name }}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        <dc-status :name="caculateStatus(record.status).name" :color="caculateStatus(record.status).color" />
      </template>
      <template slot="statisticsEndTime" slot-scope="text, record">
        <dc-endtime :remainTime="caculateTime(record)" />
      </template>
      <template slot="action" slot-scope="record">
        <span class="action-span">
          <a v-if="judgeApply(record, currentUser, roleList)" @click="showForm(record)">填报</a>
          <a v-if="judgeRedo(record, currentUser, roleList)" @click="showForm(record)">撤回</a>
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
import { taskFormDetail } from '@/api/task'
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
        { title: '表单名称', scopedSlots: { customRender: 'name' }, align: 'center', width: 260, ellipsis: true },
        { dataIndex: 'type', title: '类型', align: 'center', width: 80 },
        { dataIndex: 'responsibleOrgName', title: '负责部门', align: 'center', ellipsis: true },
        { dataIndex: 'responsibleUserName', title: '审核人', align: 'center', ellipsis: true },
        { title: '状态', align: 'center', scopedSlots: { customRender: 'status' }, width: 120 },
        { title: '填报截止倒计时', align: 'center', scopedSlots: { customRender: 'statisticsEndTime' }, width: 240 },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' }, width: 260 }
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
        return { color: 'grey', name: '待提交' }
      } else if (status == 1) {
        return { color: 'blue', name: '审核中' }
      } else if (status == 2) {
        return { color: 'green', name: '审核通过' }
      } else if (status == 3) {
        return { color: 'red', name: '退回修改' }
      } else {
        return { color: 'yellow', name: '待配置人员' }
      }
    },

    tableRowClassName(record) {
      if (record.type == '子表') {
        return 'child-row'
      }
      return ''
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
    },

    caculateTime(record) {
      if (!record.statisticsEndTime) {
        return 0
      }
      let current = new Date().getTime()
      let endTime = new Date(record.statisticsEndTime).getTime()
      return (endTime - current) / 1000
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
.right-icon {
  transform: rotate(-90deg);
}
.array-span {
  margin-left: 12px;
  margin-right: 12px;
  .anticon {
    font-size: 10px !important;
    vertical-align: 0.125em !important;
  }
}
</style>
