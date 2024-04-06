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
            <a-form-item label="统计时间">
              <a-select v-model="queryParam.schoolYear" placeholder="统计时间">
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
        <!-- <a-popconfirm title="确认删除吗？" @confirm="batchDel" v-if="selectedRowKeys.length > 0">
          <a-button type="danger"><dc-icon type="icon-dc_empty" />批量删除</a-button>
        </a-popconfirm> -->
        <a-button
          v-action="'tasklist_add'"
          type="primary"
          @click="
            $router.push({
              path: '/task/add',
              query: { taskInfo: null, fromPath: '/task/list' }
            })
          "
          ><dc-icon type="icon-dc_new" />添加任务</a-button
        >
      </div>
    </div>

    <div>
      <a-table bordered rowKey="id" :dataSource="dataSource" :pagination="ipagination" :loading="loading" :columns="renderColumns" @change="handleTableChange">
        <template slot="name" slot-scope="text, record">
          <a @click="showTaskDetail(record)">{{ record.name }}</a>
        </template>
        <template slot="percentage" slot-scope="text, record"> <a-progress :percent="record.percentage" size="small" /> </template>
        <template slot="status" slot-scope="text, record">
          <dc-status :name="caculateStatus(record).name" :color="caculateStatus(record).color" />
        </template>
        <template slot="enabled" slot-scope="text, record">
          <a-popconfirm v-if="record.enabledFlag == 1" title="任务已开启，停用后相关数据可能会丢失，是否确认停用？" @confirm="enableTask(record, 0)">
            <a-switch :checked="record.enabledFlag == 1" />
          </a-popconfirm>
          <dc-switch v-else :checked="record.enabledFlag == 1" @change="val => enableTask(record, val ? 1 : 0)" />
        </template>
        <template slot="action" slot-scope="text, record, index">
          <a @click="showTaskInfo(record)">任务概览</a>
          <a-divider type="vertical" v-if="record.status === 1 || record.status === 2" />
          <a @click="showTaskDetail(record)" v-if="record.status === 1 || record.status === 2">任务详情</a>
          <a-divider type="vertical" />
          <a-dropdown v-model="menuVisble[index]" :trigger="['click']">
            <a @click="e => e.preventDefault()">更多<a-icon type="down" /></a>
            <a-menu slot="overlay" @click="e => handleMenuClick(e, index, record)">
              <a-menu-item key="1"><a>指南下载</a></a-menu-item>
              <a-menu-item key="2"><a>模板下载</a></a-menu-item>
              <a-menu-item key="3"><a>预览报告</a></a-menu-item>
              <a-menu-item key="4"><a>导出数据</a></a-menu-item>
              <a-menu-item key="5">
                <a-popconfirm title="确认删除任务吗？" @confirm="handleDel(record.id, index)" placement="leftBottom" @cancel="() => handleCancel(index)">
                  <a><span style="color: #e23322">删除任务</span></a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </a-table>
    </div>
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { enableTask, downloadTemp } from '@/api/task'
// import { deleteAction } from '@/api/api'
export default {
  name: 'TaskList',
  mixins: [DataCollectionListMixin],
  data() {
    return {
      menuVisble: [],
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
  watch: {
    dataSource(newVal) {
      this.menuVisble = newVal.map(item => false)
    }
  },
  computed: {
    schoolYearList() {
      let startYear = 2016
      let nowYear = new Date().getFullYear()
      let yearList = []
      for (let i = nowYear; i >= startYear; i--) {
        yearList.push(i)
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
        } else if (col.title === '任务状态') {
          if (this.check('tasklist_status')) {
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
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loadData()
          this.loading = false
        })
    },

    showTaskInfo(record) {
      this.$router.push({
        path: '/task/info',
        query: { taskId: record.id, taskYear: record.year }
      })
    },

    showTaskDetail(record) {
      this.$router.push({
        path: '/task/detail',
        query: { taskId: record.id, taskName: record.name, formCollectionId: record.formCollectionId }
      })
    },

    caculateStatus(record) {
      if (record.status == 3 || record.status == '3') {
        return { name: '停用', color: 'red' }
      } else if (record.status == 1 || record.status == '1') {
        return { name: '启用中', color: 'blue' }
      } else if (record.status == 0 || record.status == '0') {
        return { name: '未启用', color: 'grey' }
      } else if (record.status == 2 || record.status == '2') {
        return { name: '完成', color: 'green' }
      }
      return { name: '启用中', color: 'blue' }
    },

    handleMenuClick(e, index, record) {
      if (e.key != 5) {
        this.menuVisble[index] = false
        this.menuVisble = { ...this.menuVisble }
        if (e.key == 3) {
          this.$router.push({ path: `/repository/list?year=${record.formCollectionYear}&type=${record.type}` })
        }
        if (e.key == 2) {
          downloadTemp(record.id).then(res => {
            if (!res) {
              this.$message.warning('导入数据下载失败！')
              return
            }
            if (typeof window.navigator.msSaveBlob !== 'undefined') {
              window.navigator.msSaveBlob(new Blob([res], { type: 'application/vnd.ms-excel' }), record.name + '.xlsx')
            } else {
              let url = window.URL.createObjectURL(new Blob([res], { type: 'appliaction/vnd.ms-excel' }))
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', record.name + '.xlsx')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              window.URL.revokeObjectURL(url)
            }
          })
        }
      } else {
        this.menuVisble[index] = true
        this.menuVisble = { ...this.menuVisble }
      }
    },

    handleCancel(index) {
      this.menuVisble[index] = false
      this.menuVisble = { ...this.menuVisble }
    },

    handleDel(id, index) {
      this.handleDelete(id)
      this.menuVisble[index] = false
      this.menuVisble = { ...this.menuVisble }
    }

    // batchDel() {
    //   this.loading = true
    //   try {
    //     this.selectedRowKeys.forEach(key => deleteAction(this.url.delete, { key }))
    //     this.$message.success('批量删除成功！')
    //   } catch {
    //     this.$message.error('部分删除失败！')
    //   } finally {
    //     this.loading = false
    //   }
    // }
  }
}
</script>

<style scoped lang="less"></style>
