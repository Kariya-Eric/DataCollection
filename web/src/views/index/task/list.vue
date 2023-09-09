<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <dc-search :items="searchItems" label-width="70px" :form="queryParam" okText="搜索" cancelText="重置" @submit="searchQuery" @cancel="searchReset" />
      <!-- Query End -->

      <div class="list-header">
        <span>任务列表</span>
        <div class="list-header-button">
          <el-button>下载导入模板</el-button>
          <el-button type="primary"><svg-icon icon-class="导入" />导入</el-button>
          <el-button type="primary" @click="handleAdd"><svg-icon icon-class="新建" />添加任务</el-button>
        </div>
      </div>

      <!-- Table Start -->
      <dc-table :data="dataSource" :columns="columns" :pagination="ipagination" @change="loadData" v-loading="loading">
        <template slot="name" slot-scope="scope">
          <a href="javascript:;" @click="showTaskInfo(scope.row)">{{ scope.row.name }}</a>
        </template>
        <template slot="status" slot-scope="scope">
          <dc-status :status="scope.row.status" />
        </template>
        <template slot="percentage" slot-scope="scope">
          <el-progress :percentage="scope.row.percentage" />
        </template>
        <template slot="enabled" slot-scope="scope">
          <el-switch v-model="scope.row.enabledFlag" :active-value="1" :inactive-value="0" @change="val => changeEnabledFlag(scope.row, val)"></el-switch>
        </template>
        <template slot="action" slot-scope="scope">
          <a @click="showTaskInfo(scope.row)">任务概览</a>
          <el-divider direction="vertical" />
          <a @click="showTaskDetail(scope.row)" v-if="scope.row.enabledFlag !== 0">任务详情</a>
          <el-divider direction="vertical" v-if="scope.row.enabledFlag !== 0" />
          <el-dropdown @command="command => handleCommand(command, scope.row)" trigger="click" :hide-on-click="false" placement="bottom" size="medium">
            <a> 更多<i class="el-icon-arrow-down el-icon--right"></i> </a>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">指南下载</el-dropdown-item>
              <el-dropdown-item command="b">模板下载</el-dropdown-item>
              <el-dropdown-item command="c">预览报告</el-dropdown-item>
              <el-dropdown-item command="d">导出数据</el-dropdown-item>
              <el-popconfirm @confirm="handleCommand('e', scope.row)" title="确认删除任务吗？">
                <el-dropdown-item slot="reference" style="color: #e23322">删除任务</el-dropdown-item>
              </el-popconfirm>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </dc-table>
      <!-- Table End -->

      <add-task-dialog ref="modalForm" @refresh="loadData" :years="schoolYearList" name="任务" />
    </el-card>
  </div>
</template>

<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
import AddTaskDialog from './components/add-task-dialog.vue'
import { enableTask, delTask } from '@/api/task'
export default {
  name: 'TaskList',
  mixins: [DataCollectionMixin],
  components: { AddTaskDialog },
  data() {
    return {
      url: {
        list: '/uc/api/task/list'
      },
      searchItems: [
        {
          label: '任务类型',
          prop: 'type',
          type: 'select',
          options: [
            { label: '教学基本状态数据', value: '教学基本状态数据' },
            { label: '其他数据', value: '教学基本状态数其他数据据' }
          ]
        },
        { label: '学年', prop: 'schoolYear', type: 'select', options: [] },
        { label: '任务名称', prop: 'name', type: 'input' }
      ],
      columns: [
        { slot: 'name', label: '任务名称' },
        { prop: 'type', label: '任务类型' },
        { prop: 'statisticsStartTime', label: '填报开始时间' },
        { prop: 'year', label: '统计时间' },
        { slot: 'status', label: '任务状态' },
        { slot: 'percentage', label: '完成进度' },
        { slot: 'enabled', label: '启用' },
        { slot: 'action', label: '操作', width: '280px' }
      ]
    }
  },
  computed: {
    schoolYearList() {
      let startYear = 2018
      let nowYear = new Date().getFullYear()
      let yearList = []
      for (let i = nowYear - 1; i >= startYear; i--) {
        let option = `${i}-${i + 1}`
        yearList.push(option)
      }
      return yearList
    }
  },

  created() {
    this.loadData(1)
  },

  methods: {
    showTaskInfo(row) {
      this.$router.push({
        path: '/task/info',
        query: { taskId: row.id }
      })
    },

    showTaskDetail(row) {
      this.$router.push({
        path: '/task/detail',
        query: { taskId: row.id, taskName: row.name }
      })
    },

    handleCommand(command, row) {
      if (command == 'e') {
        this.delTask(row)
      }
    },

    changeEnabledFlag(row, val) {
      this.loading = true
      enableTask({ id: row.id, enabledFlag: val })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    delTask(row) {
      this.loading = true
      let param = 'id=' + row.id
      delTask(param)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.loadData()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped lang="scss"></style>
