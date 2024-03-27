<template>
  <a-card class="repository-list-container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="30">
          <a-col :xs="24" :md="12" :xl="5" :xxl="6">
            <a-form-item label="业务表名">
              <a-input v-model="queryParam.name" allowClear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="12" :xl="5" :xxl="6">
            <a-form-item label="物理表名">
              <a-input v-model="queryParam.formTableCode" allowClear />
            </a-form-item>
          </a-col>
          <a-col :xs="24" :md="24" :xl="14" :xxl="12" class="table-page-search-buttons">
            <span>
              <a-button type="primary" @click="searchQuery">搜索</a-button>
              <a-button @click="searchReset">重置</a-button>
            </span>
            <span>
              <a-button type="danger" @click="handleDelete"><dc-icon type="icon-dc_empty" />清空当年数据</a-button>
              <a-button type="primary" @click="openImport = true"><dc-icon type="icon-dc_import" />导入</a-button>
              <a-button type="primary" @click="openExport = true"><dc-icon type="icon-dc_export" />导出</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <a-table rowKey="id" :dataSource="dataSource" :pagination="ipagination" :loading="loading" :columns="columns" @change="handleTableChange">
      <template slot="type" slot-scope="text, record">
        <a-tag :class="record.type == '固定表单' ? 'fixed-tag' : 'float-tag'" style="text-align: center">
          <span :style="{ color: record.type == '固定表单' ? '#2b9e77' : '#2f68bd' }">{{ record.type }}</span>
        </a-tag>
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="showDetail(record, 0)">查看数据</a>
        <a-divider type="vertical" />
        <a @click="showDetail(record, 1)">字段属性</a>
      </template>
    </a-table>

    <a-modal
      class="import-modal"
      :visible="openImport"
      title="导入"
      :width="600"
      :maskClosable="false"
      :confirm-loading="confirmImportLoading"
      @ok="confirmImport"
      @cancel="openImport = false"
    >
      <a-form>
        <a-form-item label="年份">
          <a-input :value="year" disabled />
        </a-form-item>
        <a-form-item label="类型">
          <a-input :value="menu?.type || ''" disabled />
        </a-form-item>
        <a-row :gutter="20">
          <a-col>
            <a-upload accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" :customRequest="handleUpload" :showUploadList="false">
              <a-button type="primary">选择文件</a-button>
            </a-upload>
          </a-col>
          <a-col>
            <a-button @click="downloadTemplate">下载导入模板</a-button>
          </a-col>
        </a-row>
        <div class="import-result-list">
          <div v-for="item in importFileList" :key="item.uid" class="import-file-item">
            <span>{{ item.name }}</span
            ><a-icon type="delete" title="删除文件" @click="removeUpload"></a-icon>
          </div>
        </div>
      </a-form>
    </a-modal>

    <a-modal
      class="import-modal"
      :visible="openExport"
      title="导出"
      :width="600"
      :maskClosable="false"
      :confirm-loading="confirmExportLoading"
      @ok="confirmExport"
      @cancel="openExport = false"
    >
      <a-form :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
        <a-form-item label="年份">
          <a-input :value="year" disabled />
        </a-form-item>
        <a-form-item label="类型">
          <a-input :value="menu?.type || ''" disabled />
        </a-form-item>
        <a-form-item label="表单名称">
          <a-select
            v-model="exportForms"
            mode="multiple"
            style="width: 100%"
            placeholder="默认全选，可多选"
            :options="dataSource.map(item => ({ value: item.id, label: item.name }))"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import api from '@/api/repository'
const listApi = '/uc/api/dataWarehouse/getFormListById/'
export default {
  name: 'RepositoryList',
  mixins: [DataCollectionListMixin],
  data() {
    return {
      url: {
        list: ''
      },
      columns: [
        // { title: '序号', width: 70, align: 'center', key: 'rowIndex', customRender: (t, r, index) => parseInt(index) + 1 },
        { title: '业务表名', dataIndex: 'name' },
        { title: '物理表名', dataIndex: 'formTableCode' },
        { title: '表单类型', scopedSlots: { customRender: 'type' } },
        { title: '前置表单', dataIndex: 'preFormNames' },
        { title: '操作', scopedSlots: { customRender: 'action' } }
      ],
      exportTableName: '数据列表',
      openExport: false,
      confirmExportLoading: false,
      exportForms: [],
      openImport: false,
      confirmImportLoading: false,
      importFileList: []
    }
  },
  computed: {
    ...mapState({
      menu: state => state.repository.repositorySelMenu,
      year: state => state.repository.repositorySelYear
    })
  },
  watch: {
    menu() {
      this.renderData()
    }
  },
  mounted() {
    this.renderData()
  },
  methods: {
    renderData() {
      // 初始化导入导出表单
      this.importFileList = []
      this.exportForms = []
      if (this.menu) {
        this.url.list = listApi + this.menu.id
        this.queryParam.formCategories = this.menu.formCategories || ''
        this.loadData(1)
      } else {
        this.dataSource = []
        this.ipagination.current = 1
        this.ipagination.total = 0
        this.loading = false
      }
    },
    showDetail(record, tab) {
      this.$store.commit('SET_REPOSITORYSELFORM', record)
      this.$router.push({
        path: '/repository/detail',
        query: { tab }
      })
    },
    // 下载导入模板
    downloadTemplate() {
      api.downloadTemplate(this.menu.id).then(data => {
        if (!data) {
          this.$message.warning('导入模板下载失败！')
          return
        }
        this.downFile(data, `${this.menu.name}导入模板`)
      })
    },
    // 选择文件
    handleUpload(info) {
      this.importFileList = [info.file]
    },
    // 删除选中文件
    removeUpload() {
      this.importFileList = []
    },
    // 导入
    confirmImport() {
      console.log(this.importFileList)
      if (this.importFileList.length === 0) {
        this.$message.warning('请先上传文件')
        return
      }
      this.confirmImportLoading = true
      const formData = new FormData()
      formData.append('file', this.importFileList[0])
      api
        .importData(this.menu.id, formData)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.openImport = false
            this.importFileList = []
            this.loadData(1)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.confirmImportLoading = false))
    },
    downFile(data, fileName) {
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xlsx')
      } else {
        let url = window.URL.createObjectURL(new Blob([data], { type: 'appliaction/vnd.ms-excel' }))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName + '.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    },
    // 导出
    confirmExport() {
      this.confirmExportLoading = true
      api
        .exportData(this.menu.id, { formIds: this.exportForms.join(',') })
        .then(data => {
          if (!data) {
            this.$message.warning('导出失败！')
            return
          }
          this.downFile(data, this.menu.name)
          this.exportForms = []
          this.openExport = false
        })
        .finally(() => {
          this.confirmExportLoading = false
        })
    },
    // 清空当年数据
    handleDelete() {
      api.deleteData(this.menu.id).then(res => {
        if (res.state) {
          this.$message.success(res.message)
          this.loadData(1)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.repository-list-container {
  .table-page-search-buttons {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 0;
    .ant-btn{
      margin-bottom:24px;
    }
  }
  /deep/.ant-card-body {
    padding: 20px;
  }
}
.import-modal {
  color: red;
  /deep/.ant-modal-body {
    .ant-form-item {
      display: flex;
      margin-bottom: 20px;
    }
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 32px;
    }
    .ant-form-item-label label {
      margin-right: 10px;
      &::before {
        content: '* ';
        color: rgba(234, 51, 34, 0.85);
      }
      &::after {
        display: none;
      }
    }
    .ant-row {
      display: flex;
      .ant-col {
        position: static;
      }
      button {
        min-width: 104px;
      }
    }
    .ant-upload-list {
      position: absolute;
      width: calc(100% - 20px);
      margin-top: 21px;
      padding: 0 10px;
      height: 208px;
      overflow-y: auto;
    }
  }
  /deep/.ant-modal-footer {
    text-align: right !important;
  }
  .import-result-list {
    margin-top: 20px;
    height: 210px;
    background: #f4f8ff;
    border-radius: 4px;
    border: 1px dashed #bdceee;
    padding: 10px;
  }
  .import-file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: 30px;
    transition: background-color 0.3s;
    &:first-child {
      margin-top: 0;
    }
    .anticon {
      display: none;
    }
    &:hover {
      background-color: #edf6fc;
      .anticon {
        display: block;
      }
    }
  }
}
</style>
