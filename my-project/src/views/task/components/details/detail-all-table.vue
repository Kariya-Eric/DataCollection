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
      :expanded-row-keys.sync="expandedKeys"
    >
      <template slot="expandIcon" slot-scope="props">
        <span class="array-span">
          <dc-icon type="icon-dc_arrow" v-if="props.expanded" @click="() => props.onExpand()" />
          <dc-icon type="icon-dc_arrow" class="right-icon" v-if="!props.expanded && props.record.children.length > 0" @click="() => props.onExpand()" />
        </span>
      </template>
      <template slot="name" slot-scope="text, record">
        <dc-icon type="icon-dc_form_table" v-if="record.name" :style="{ 'font-size': '16px', color: record.formType === '固定表单' ? '#2B9E77' : '#2F68BD' }" />
        <span style="margin-left: 8px">{{ record.name }}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        <dc-status :name="caculateStatus(record.status).name" :color="caculateStatus(record.status).color" />
      </template>

      <template slot="action" slot-scope="record">
        <span class="action-span">
          <a v-if="judgeConfig(record, currentUser, roleList)" @click="$refs.configUserModal.show(record)">配置人员</a>
          <a v-if="judgeApply(record, currentUser, roleList)" @click="showForm(record)">填报</a>
          <a-popconfirm @confirm="redoForm(record.id)" title="确认要撤回该表吗"> </a-popconfirm>
          <a v-if="judgeRedo(record, currentUser, roleList)" @click="showForm(record)">撤回</a>
          <a v-if="judgeAudit(record, currentUser, roleList)" @click="showForm(record)">审核</a>
          <a v-if="judgeShow(record, currentUser, roleList)" @click="showForm(record)">查看</a>
          <a v-if="judgeRemind(record, currentUser, roleList)" @click="pushNotice(record)">催办</a>
          <a v-if="judgeProgress(record, currentUser, roleList)" @click="$refs.progressDrawer.show(record)">填报进度</a>
        </span>
      </template>
    </a-table>
    <form-drawer ref="formDrawer" @refresh="refreshData" />
    <progress-drawer ref="progressDrawer" />
    <config-user-modal ref="configUserModal" @refresh="refreshData" />
  </div>
</template>

<script>
const listUrl = '/uc/api/taskFormDetail/list/'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { handlerData } from './utils'
import { judgeShow, judgeApply, judgeAudit, judgeProgress, judgeRedo, judgeRemind, judgeConfig } from './auth'
import { USER_INFO, ROLE_LIST } from '@/store/mutation-types'
import { taskFormDetail } from '@/api/task'
import { pushNotice } from '@/api/notice'
import FormDrawer from './form-drawer'
import ProgressDrawer from './progress-drawer'
import storage from 'store'
import ConfigUserModal from './config-user-modal.vue'

export default {
  name: 'DetailAllTable',
  mixins: [DataCollectionListMixin],
  components: { FormDrawer, ProgressDrawer, ConfigUserModal },
  props: ['taskId'],
  data() {
    return {
      judgeShow,
      judgeApply,
      judgeAudit,
      judgeProgress,
      judgeRedo,
      judgeRemind,
      judgeConfig,
      handlerData,
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
        { dataIndex: 'collaborateOrgName', title: '填报部门', align: 'center' },
        { dataIndex: 'fillUserName', title: '填报人', align: 'center' },
        { dataIndex: 'responsibleUserName', title: '审核人', align: 'center' },
        { title: '状态', align: 'center', scopedSlots: { customRender: 'status' } },
        { title: '统计截止时间', align: 'center', scopedSlots: { customRender: 'statisticsEndTime' } },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },

  watch: {
    taskId: {
      handler(newVal) {
        if (newVal) {
          this.refreshData(1)
        }
      },
      immediate: true
    }
  },

  methods: {
    refreshData(args) {
      this.url.list = `${listUrl}?taskId=${this.taskId}&type=ALL`
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

    pushNotice(record) {
      let userId = this.currentUser.userId
      let param = {
        messageType: 'PC',
        content: `您有一个数据采集任务 “${record.formName}” 待完成`,
        userId,
        targetLink: `/task/detail?taskId=${this.taskId}`
      }
      pushNotice(param).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
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
    font-size: 10px;
    vertical-align: 0.125em;
  }
}
</style>
