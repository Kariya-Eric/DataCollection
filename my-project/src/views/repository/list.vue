<template>
  <a-card class="repository-list-container">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="30">
          <a-col :xl="6" :lg="12">
            <a-form-item label="业务表名">
              <a-input v-model="queryParam.name" allowClear />
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="12">
            <a-form-item label="物理表名">
              <a-input v-model="queryParam.formTableCode" allowClear />
            </a-form-item>
          </a-col>
          <a-col :xl="12" :lg="24" class="table-page-search-buttons">
            <span>
              <a-button type="primary" @click="searchQuery">搜索</a-button>
              <a-button @click="searchReset">重置</a-button>
            </span>
            <span>
              <a-button type="primary" @click="openImport = true"><dc-icon type="icon-dc_import" />导入</a-button>
              <a-button type="primary" @click="handleExport(exportTableName)"><dc-icon type="icon-dc_export" />导出</a-button>
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

    <a-modal class="import-modal" :visible="openImport" title="导入" :width="600" :confirm-loading="confirmImportLoading" @ok="handleImport" @cancel="handleCancelImport">
      <a-form-item label="年份">
        <a-input :value="year" disabled />
      </a-form-item>
      <a-form-item label="类型">
        <a-input :value="menu?.type || ''" disabled />
      </a-form-item>
      <a-row :gutter="20">
        <a-col>
          <a-upload :customRequest="handleUpload">
            <a-button type="primary">选择文件</a-button>
          </a-upload>
        </a-col>
        <a-col>
          <a-button @click="">下载导入模板</a-button>
        </a-col>
      </a-row>
      <div class="import-result-list">{{ importResult }}</div>
    </a-modal>
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
const listApi = '/uc/api/dataWarehouse/getFormListById/'
export default {
  name: 'RepositoryList',
  mixins: [DataCollectionListMixin],
  data() {
    return {
      url: {
        list: '',
        exportUrl: '/uc/api/user/export'
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
      openImport: false,
      confirmImportLoading: false,
      importResult: ''
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
    // 上传
    handleUpload() {},
    // 导入
    handleImport() {
      this.confirmImportLoading = true
      setTimeout(() => {
        // this.openImport = false
        this.confirmImportLoading = false
      }, 2000)
    },
    handleCancelImport() {
      this.openImport = false
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
      max-height: 208px;
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
  }
}
</style>
