<template>
  <div>
    <dc-table
      v-loading="loading"
      :data="handlerData(dataSource)"
      :row-key="record => record.id + record.type"
      default-expand-all
      :columns="columns"
      :row-class-name="tableRowClassName"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :pagination="ipagination"
      @change="loadData"
    >
      <template slot="name" slot-scope="scope">
        <svg-icon icon-class="固定表单" v-if="scope.row.name" />
        <span>{{ scope.row.name }}</span>
      </template>

      <template slot="status" slot-scope="scope">
        <dc-status :status="caculateStatus(scope.row.status).status" :title="caculateStatus(scope.row.status).name" />
      </template>

      <template slot="action" slot-scope="scope">
        <a v-if="judgeApply(scope.row, currentUser)" @click="showForm(scope.row)">填报</a>
        <el-divider direction="vertical" v-if="judgeRedo(scope.row, currentUser)" />
        <el-popconfirm v-if="judgeRedo(scope.row, currentUser)" @confirm="redoForm(scope.row)" title="确认要撤回该表吗">
          <a href="javascript:;" slot="reference">撤回</a>
        </el-popconfirm>
        <el-divider direction="vertical" v-if="judgeShow(scope.row, currentUser)" />
        <a v-if="judgeShow(scope.row, currentUser)" @click="showForm(scope.row)">查看</a>
      </template>
    </dc-table>

    <form-drawer ref="formDrawer" @refresh="loadData" />
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
import { taskFormDetail, recallForm } from '@/api/task'
import { judgeShow, judgeApply, judgeRedo } from './auth'
import FormDrawer from './form-drawer'
import { USER_INFO } from '@/store/mutation-types'
import { handlerData } from './validate'
export default {
  name: 'DetailAllTable',
  props: ['taskId'],
  mixins: [DataCollectionMixin],
  components: { FormDrawer },
  data() {
    return {
      judgeApply,
      judgeShow,
      judgeRedo,
      handlerData,
      currentUser: this.$ls.get(USER_INFO),
      url: {
        list: ''
      },
      listUrl: '/uc/api/taskFormDetail/list/',
      columns: [
        { slot: 'name', label: '表单名称' },
        { prop: 'responsibleOrgName', label: '负责部门' },
        { prop: 'responsibleUserName', label: '审核人' },
        { slot: 'status', label: '状态' },
        { slot: 'statisticsEndTime', label: '统计截止时间' },
        { slot: 'action', label: '操作' }
      ]
    }
  },
  mounted() {
    this.url.list = `${this.listUrl}?taskId=${this.taskId}&type=FILL`
    this.loadData(1)
  },

  methods: {
    calculateEndTime(date) {
      return new Date(date).getTime()
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

    tableRowClassName({ row, rowIndex }) {
      if (row.type == '子表') {
        return 'child-row'
      }
      return ''
    },

    showForm(row) {
      taskFormDetail(row.id).then(res => {
        if (res.state) {
          if (res.value.formProperties && res.value.componentProperties) {
            const formProperties = JSON.parse(res.value.formProperties)
            const fields = JSON.parse(res.value.componentProperties)
            const data = res.value.formData == null ? null : JSON.parse(res.value.formData)
            let formData = { ...formProperties, fields, data }
            this.$refs.formDrawer.show(formData, res.value.formName, res.value.id, res.value.status)
          } else {
            this.$message.error('该表单未配置任何组件，请先设计表单！')
          }
        }
      })
    },

    redoForm(row) {
      recallForm(row.id).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.el-table .child-row {
  background: #f2f7ff;
}
/deep/ .el-statistic .con .number {
  font-size: 16px;
}
</style>
