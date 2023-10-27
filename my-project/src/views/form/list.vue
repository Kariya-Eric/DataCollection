<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="4" :sm="12">
            <a-form-item label="年份">
              <a-select v-model="queryParam.year" placeholder="请选择年份">
                <a-select-option v-for="item in yearList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="类型">
              <a-select v-model="queryParam.type" placeholder="请选择类型">
                <a-select-option value="教学基本状态数据">教学基本状态数据</a-select-option>
                <a-select-option value="其他数据">其他数据</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="12">
            <a-form-item label="合集名称">
              <a-input v-model="queryParam.name" placeholder="请输入合集名称"></a-input>
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
      <span>合集列表</span>
      <div class="table-operator-button">
        <a-button type="primary" @click="handleAdd('新增合集')"><dc-icon type="icon-dc_new" />新建合集</a-button>
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
        :columns="columns"
        @change="handleTableChange"
      >
        <template slot="name" slot-scope="text, record">
          <a @click="showCollectionDetail(record)">{{ record.name }}</a>
        </template>
        <template slot="guidFiles" slot-scope="text, record">
          <div v-for="(guidFile, index) in JSON.parse(record.guidFiles)" :key="index">
            <a download href="javascript:;" @click="downloadGuid(guidFile)" :title="guidFile.fileName">{{ guidFile.fileName }}</a>
          </div>
        </template>
        <template slot="enabledFlag" slot-scope="text, record">
          <dc-switch v-model="record.enabledFlag" @change="val => enableCollection(val, record.id)" />
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="showCollectionDetail(record)">合集详情</a>
          <a-divider type="vertical" />
          <a @click="showCollection(record)">合集属性</a>
          <a-divider type="vertical" />
          <a @click="handleUpload(record)">指南管理</a>
          <a-divider type="vertical" />
          <a-popconfirm title="合集删除后不可恢复，是否确认删除？" @confirm="handleDelete(record.id)"> <a style="color: #e23322">删除合集</a></a-popconfirm>
        </template>
      </a-table>
    </div>

    <collection-modal ref="modalForm" @ok="modalFormOk" />
    <guild-files-modal ref="guideFilesDialog" @ok="loadData" />
  </a-card>
</template>

<script>
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import CollectionModal from './components/collection/collection-modal.vue'
import { enableCollection } from '@/api/form'
import GuildFilesModal from './components/collection/guild-files-modal.vue'
export default {
  components: { CollectionModal, GuildFilesModal },
  mixins: [DataCollectionListMixin],
  data() {
    return {
      url: {
        list: '/uc/api/formCollection/list',
        delete: '/uc/api/formCollection/delete'
      },
      columns: [
        { title: '合集名称', align: 'center', scopedSlots: { customRender: 'name' } },
        { dataIndex: 'type', title: '合集类型', align: 'center' },
        { dataIndex: 'year', title: '年份', align: 'center', sorter: true },
        { dataIndex: 'guidFiles', title: '填报指南', align: 'center', scopedSlots: { customRender: 'guidFiles' } },
        { title: '启用', align: 'center', scopedSlots: { customRender: 'enabledFlag' } },
        { title: '操作', width: 340, align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  created() {
    this.loadData(1)
  },
  computed: {
    yearList() {
      let years = new Set()
      this.dataSource.forEach(data => years.add(data.year))
      return [...years].sort().map(item => {
        return { label: item, value: item }
      })
    }
  },
  methods: {
    downloadGuid(file) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = file.filePath
      link.setAttribute('download', file.name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(file.filePath)
    },

    showCollection(record) {
      this.handleEdit(record, '合集属性')
      this.$refs.modalForm.disabled = record.enabledFlag == 1
    },

    enableCollection(val, id) {
      this.loading = true
      enableCollection({ id, enabledFlag: val })
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

    showCollectionDetail(record) {
      this.$router.push({
        path: '/form/detail',
        query: { collectionInfo: JSON.stringify(record) }
      })
    },

    handleUpload(record) {
      this.$refs.guideFilesDialog.show(record)
    }
  }
}
</script>

<style scoped lang="less"></style>
