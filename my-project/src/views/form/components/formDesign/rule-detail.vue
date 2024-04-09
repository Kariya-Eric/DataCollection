<template>
  <div style="padding: 24px 12px; backgroundColor: white">
    <a-button type="primary" style="float: right; margin-bottom: 16px" @click="handleAdd('添加校验')"><dc-icon type="icon-dc_new" />添加校验</a-button>
    <div style="clear: both">
      <a-table bordered rowKey="id" :dataSource="dataSource" :pagination="ipagination" :loading="loading" :columns="columns" @change="handleTableChange">
        <template slot="verifyMode" slot-scope="text, record">
          {{ record.verifyMode == 'current' ? '表内校验' : '表间校验' }}
        </template>
        <template slot="type" slot-scope="text, record">
          <span v-if="record.type == 'dataRange'">数据范围校验</span>
          <span v-else-if="record.type == 'unique'">唯一性校验</span>
          <span v-else-if="record.type == 'exclusivity'">排他性校验</span>
          <span v-else-if="record.type == 'consistency'">一致性校验</span>
          <span v-else-if="record.type == 'dateTime'">时间日期校验</span>
          <span v-else>自定义校验</span>
        </template>
        <template slot="enabledFlag" slot-scope="text, record">
          <dc-switch v-model="record.enabledFlag" @change="val => enableRule(val, record)" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record, '修改校验')">查看</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认删除该校验规则吗？" @confirm="handleDelete(record.id)">
            <a><span style="color: red">删除</span></a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <rule-modal ref="modalForm" :drawingList="drawingList" :formId="formId" @ok="refreshData" />
  </div>
</template>

<script>
const listUrl = '/uc/api/formVerification/list/'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { enableRule } from '@/api/form'
import RuleModal from './components/rule-modal.vue'
export default {
  name: 'RuleDetail',
  mixins: [DataCollectionListMixin],
  props: ['drawingList', 'formId'],
  components: { RuleModal },
  data() {
    return {
      url: {
        list: '',
        delete: '/uc/api/formVerification/delete'
      },
      columns: [
        { dataIndex: 'name', title: '校验名称', align: 'center' },
        { title: '校验模式', align: 'center', scopedSlots: { customRender: 'verifyMode' } },
        { title: '前置表单', align: 'center', dataIndex: 'preFormNames' },
        { title: '校验类型', align: 'center', scopedSlots: { customRender: 'type' } },
        { title: '校验失败提示信息', align: 'center', dataIndex: 'message', ellipsis: true },
        { title: '启用', align: 'center', scopedSlots: { customRender: 'enabledFlag' } },
        { title: '操作', align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  mounted() {
    this.refreshData(1)
  },
  methods: {
    refreshData(args) {
      this.url.list = listUrl + this.formId
      this.loadData(args)
    },

    enableRule(val, record) {
      this.loading = true
      enableRule(record)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.refreshData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style lang="less" scoped></style>
