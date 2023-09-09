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
        <el-popconfirm
          v-if="judgeAudit(scope.row, currentUser)"
          @confirm="authForm(scope.row)"
          @cancel="authFormBack(scope.row)"
          confirm-button-text="通过"
          cancel-button-text="驳回"
          title="如何操作该表？"
        >
          <a slot="reference">审核</a>
        </el-popconfirm>
        <el-divider direction="vertical" v-if="judgeAudit(scope.row, currentUser)" />
        <a @click="showProgress(scope.row)" v-if="judgeProgress(scope.row, currentUser)">填报进度</a>
        <el-divider direction="vertical" v-if="judgeProgress(scope.row, currentUser)" />
        <a @click="pushNotice(scope.row)" v-if="judgeRemind(scope.row, currentUser)">催办</a>
        <el-divider direction="vertical" v-if="judgeRemind(scope.row, currentUser)" />
        <a v-if="judgeShow(scope.row, currentUser)" @click="showForm(scope.row)">查看</a>
      </template>
    </dc-table>

    <form-drawer ref="formDrawer" @refresh="loadData" />
    <progress-drawer ref="progressDrawer" />
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
import { taskFormDetail, approveForm } from '@/api/task'
import { pushNotice } from '@/api/notice'
import { judgeShow, judgeAudit, judgeProgress, judgeRemind } from './auth'
import FormDrawer from './form-drawer'
import ProgressDrawer from './progress-drawer'
import { USER_INFO } from '@/store/mutation-types'
import { handlerData } from './validate'
export default {
  name: 'DetailAllTable',
  props: ['taskId'],
  components: { FormDrawer, ProgressDrawer },
  mixins: [DataCollectionMixin],
  data() {
    return {
      judgeShow,
      judgeAudit,
      judgeProgress,
      judgeRemind,
      handlerData,
      currentUser: this.$ls.get(USER_INFO),
      url: {
        list: ''
      },
      listUrl: '/uc/api/taskFormDetail/list/',
      columns: [
        { slot: 'name', label: '表单名称' },
        { prop: 'type', label: '类型' },
        { prop: 'responsibleOrgName', label: '负责部门' },
        { prop: 'collaborateOrgName', label: '填报部门' },
        { prop: 'fillUserName', label: '填报人' },
        { slot: 'status', label: '状态' },
        { slot: 'statisticsEndTime', label: '统计截止时间' },
        { slot: 'action', label: '操作' }
      ]
    }
  },

  mounted() {
    this.url.list = `${this.listUrl}?taskId=${this.taskId}&type=APPROVE`
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

    authForm(row) {
      let param = { id: row.id, status: 2 }
      approveForm(param).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    authFormBack(row) {
      let param = { id: row.id, status: 3 }
      approveForm(param).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
    },

    showProgress(row) {
      this.$refs.progressDrawer.show(row)
    },

    pushNotice(row) {
      let userId = this.currentUser.userId
      let param = {
        messageType: 'PC',
        content: `您有一个数据采集任务 “${row.formName}” 待完成`,
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
