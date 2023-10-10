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
      :expanded-row-keys.sync="expandedKeys"
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
        <a v-if="judgeConfig(record, currentUser)">配置人员</a>
        <a-divider type="vertical" v-if="judgeConfig(record, currentUser) && judgeApply(record, currentUser)" />
        <a v-if="judgeApply(record, currentUser)">填报</a>
        <a-divider type="vertical" v-if="judgeRedo(record, currentUser) && judgeApply(record, currentUser)" />
        <a v-if="judgeRedo(record, currentUser)">撤回</a>
        <a-divider type="vertical" v-if="judgeRedo(record, currentUser) && judgeAudit(record, currentUser)" />
        <a v-if="judgeAudit(record, currentUser)">审核</a>
        <a-divider type="vertical" v-if="judgeShow(record, currentUser) && judgeAudit(record, currentUser)" />
        <a v-if="judgeShow(record, currentUser)">查看</a>
        <a-divider type="vertical" v-if="judgeShow(record, currentUser) && judgeRemind(record, currentUser)" />
        <a v-if="judgeRemind(record, currentUser)">催办</a>
        <a-divider type="vertical" v-if="judgeProgress(record, currentUser) && judgeRemind(record, currentUser)" />
        <a v-if="judgeProgress(record, currentUser)">填报进度</a>
      </template>
    </a-table>
  </div>
</template>

<script>
const listUrl = '/uc/api/taskFormDetail/list/'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { handlerData } from './utils'
import { judgeShow, judgeApply, judgeAudit, judgeProgress, judgeRedo, judgeRemind, judgeConfig } from './auth'
import { USER_INFO } from '@/store/mutation-types'
import storage from 'store'
export default {
  name: 'DetailAllTable',
  mixins: [DataCollectionListMixin],
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
    }
  }
}
</script>

<style lang="less">
.child-row {
  background: #f2f7ff;
}
</style>
