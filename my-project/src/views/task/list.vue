<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="12">
            <a-form-item label="任务类型">
              <a-select v-model="queryParam.type" placeholder="请选择任务类型">
                <a-select-option value="教学基本状态数据">教学基本状态数据</a-select-option>
                <a-select-option value="其他数据">其他数据</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="学年">
              <a-select v-model="queryParam.schoolYear" placeholder="请选择学年">
                <a-select-option v-for="year in schoolYearList" :key="year" :value="year">{{ year }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="任务名称">
              <a-input v-model="queryParam.name" placeholder="请输入任务名称"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="3" :sm="12">
            <span class="table-page-search-buttons">
              <a-button type="primary" icon="search" @click="searchQuery">搜索</a-button>
              <a-button type="primary" icon="reload" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <span>任务列表</span>
      <div class="table-operator-button">
        <a-button v-action="'tasklist_download'">下载导入模板</a-button>
        <a-button v-action="'tasklist_import'" type="primary"><dc-icon type="icon-dc_import" />导入</a-button>
        <a-button v-action="'tasklist_add'" type="primary" @click="handleAdd('添加任务')"><dc-icon type="icon-dc_new" />添加任务</a-button>
      </div>
    </div>

    <div>
      <a-table
        bordered
        rowKey="id"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="renderColumns"
        @change="handleTableChange"
      >
        <template slot="name" slot-scope="text, record">
          <a @click="showTaskInfo(record)">{{ record.name }}</a>
        </template>
        <template slot="percentage" slot-scope="text, record"> <a-progress :percent="record.percentage" size="small" /> </template>
        <template slot="status" slot-scope="text, record">
          <dc-status :name="caculateStatus(record).name" :color="caculateStatus(record).color" />
        </template>
        <template slot="enabled" slot-scope="text, record">
          <dc-switch v-model="record.enabledFlag" @change="val => enableTask(record, val)" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="showTaskInfo(record)">任务概览</a>
          <a-divider type="vertical" />
          <a @click="showTaskDetail(record)" v-if="record.enabledFlag !== 0">任务详情</a>
          <a-divider type="vertical" />
          <a-dropdown :trigger="['click']">
            <a>更多<a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item><a>指南下载</a></a-menu-item>
              <a-menu-item><a>模板下载</a></a-menu-item>
              <a-menu-item><a>预览报告</a></a-menu-item>
              <a-menu-item><a>导出数据</a></a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确认删除任务吗？" @confirm="handleDelete(record.id)">
                  <a><span style="color: #e23322">删除任务</span></a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
    </div>
    <task-modal ref="modalForm" @ok="loadData" :years="schoolYearList" />
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { enableTask } from '@/api/task'
import TaskModal from './components/task-modal.vue'
export default {
  name: 'TaskList',
  mixins: [DataCollectionListMixin],
  components: { TaskModal },
  data() {
    return {
      url: {
        list: '/uc/api/task/list',
        delete: '/uc/api/task/delete'
      },
      columns: [
        { title: '任务名称', align: 'center', scopedSlots: { customRender: 'name' } },
        { dataIndex: 'type', title: '任务类型', align: 'center' },
        { dataIndex: 'statisticsStartTime', title: '填报开始时间', align: 'center', sorter: true },
        { dataIndex: 'statisticsEndTime', title: '填报截止时间', align: 'center', sorter: true },
        { dataIndex: 'year', title: '统计时间', align: 'center' },
        { title: '任务状态', align: 'center', scopedSlots: { customRender: 'status' } },
        { title: '完成进度', align: 'center', scopedSlots: { customRender: 'percentage' } },
        { title: '启用', align: 'center', scopedSlots: { customRender: 'enabled' } },
        { title: '操作', width: 290, align: 'center', scopedSlots: { customRender: 'action' } }
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
    },
    renderColumns() {
      let columns = []
      this.columns.forEach(col => {
        if (col.title === '完成进度') {
          if (this.check('tasklist_progress')) {
            columns.push(col)
          }
        } else if (col.title === '启用') {
          if (this.check('tasklist_enable')) {
            columns.push(col)
          }
        } else {
          columns.push(col)
        }
      })
      return columns
    }
  },
  created() {
    this.loadData(1)
  },
  methods: {
    enableTask(record, val) {
      this.loading = true
      enableTask({ id: record.id, enabledFlag: val })
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

    showTaskInfo(record) {
      this.$router.push({
        path: '/task/info',
        query: { taskId: record.id }
      })
    },

    showTaskDetail(record) {
      this.$router.push({
        path: '/task/detail',
        query: { taskId: record.id, taskName: record.name }
      })
    },

    caculateStatus(record) {
      if (record.status == 0 || record.status == '0') {
        return { name: '停用', color: 'red' }
      } else if (record.status == 1 || record.status == '1') {
        return { name: '启用中', color: 'blue' }
      } else if (record.status == 2 || record.status == '2') {
        return { name: '未启用', color: 'grey' }
      } else if (record.status == 3 || record.status == '3') {
        return { name: '完成', color: 'green' }
      }
      return { name: '启用中', color: 'blue' }
    }
  }
}
</script>

<style scoped lang="less"></style>
