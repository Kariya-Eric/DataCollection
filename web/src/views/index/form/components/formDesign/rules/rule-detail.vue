<template>
  <div class="ruleDiv">
    <el-button type="primary" @click="addRule">添加校验</el-button>
    <dc-table v-loading="loading" :data="dataSource" :columns="columns" :pagination="ipagination" @change="loadData">
      <template slot="verifyMode" slot-scope="scope">
        {{ scope.row.verifyMode == 'current' ? '表内校验' : '表间校验' }}
      </template>
      <template slot="type" slot-scope="scope">
        <span v-if="scope.row.type == 'dataRange'">数据范围校验</span>
        <span v-else-if="scope.row.type == 'unique'">唯一性校验</span>
        <span v-else-if="scope.row.type == 'exclusivity'">排他性校验</span>
        <span v-else-if="scope.row.type == 'consistency'">一致性校验</span>
        <span v-else-if="scope.row.type == 'dateTime'">时间日期校验</span>
        <span v-else>自定义校验</span>
      </template>
      <template slot="enabledFlag" slot-scope="scope">
        <el-switch disabled v-model="scope.row.enabledFlag" :inactive-value="0" :active-value="1" />
      </template>
      <template slot="action" slot-scope="scope">
        <a @click="updateRule(scope.row)">查看</a>
        <el-divider direction="vertical" />
        <el-popconfirm title="确认删除该校验规则吗？" @confirm="handleDelete(scope.row)">
          <a href="javascript:;" slot="reference">删除</a>
        </el-popconfirm>
      </template>
    </dc-table>
    <rule-dialog ref="ruleDialog" :drawingList="drawingList" :formId="formId" @refresh="loadData" />
  </div>
</template>

<script>
import RuleDialog from './rule-dialog'
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
export default {
  name: 'RuleDetail',
  components: { RuleDialog },
  props: ['drawingList', 'formId'],
  mixins: [DataCollectionMixin],
  data() {
    return {
      url: {
        list: '/uc/api/formVerification/list',
        delete: '/uc/api/formVerification/delete'
      },
      columns: [
        { prop: 'name', label: '校验名称' },
        { slot: 'verifyMode', label: '校验模式' },
        { prop: 'preFormNames', label: '前置表单' },
        { slot: 'type', label: '校验类型' },
        { prop: 'message', label: '校验失败提示信息' },
        { slot: 'enabledFlag', label: '启用' },
        { slot: 'action', label: '操作', width: '220px' }
      ]
    }
  },
  mounted() {
    this.url.list = `${this.url.list}/${this.formId}`
    this.loadData(1)
  },
  methods: {
    addRule() {
      this.$refs.ruleDialog.show()
    },

    updateRule(row) {
      this.$refs.ruleDialog.show(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.ruleDiv {
  padding: 24px;
  .el-button {
    float: right;
    margin-bottom: 12px;
  }
}
</style>
