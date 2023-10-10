<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <dc-search :form="queryParam" :items="searchItems" okText="搜索" cancelText="重置" @submit="searchQuery" @cancel="searchReset" />

      <div class="list-header">
        <span>合集列表</span>
        <div class="list-header-button">
          <el-button @click="handleAdd" type="primary"> <svg-icon icon-class="新建" />新建合集 </el-button>
        </div>
      </div>

      <!-- Table Start -->
      <dc-table
        v-loading="loading"
        @selection-change="onSelectChange"
        :data="dataSource"
        :columns="columns"
        :pagination="ipagination"
        selection="selection"
        @change="loadData"
      >
        <template slot="name" slot-scope="scope">
          <a href="javascript:;">{{ scope.row.name }}</a>
        </template>
        <template slot="guidFiles" slot-scope="scope" v-if="scope.row.guidFiles">
          <p v-for="(guidFile, index) in JSON.parse(scope.row.guidFiles)" :key="index">
            <a href="javascript:;" @click="downloadGuid(guidFile)"><dc-ellipsis :value="guidFile.fileName" :length="40" /></a>
          </p>
        </template>
        <template slot="enabled" slot-scope="scope">
          <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.enabledFlag" @change="val => enableCollection(val, scope.row)"></el-switch>
        </template>
        <template slot="action" slot-scope="scope">
          <a @click="showCollectionDetail(scope.row)">合集详情</a>
          <el-divider direction="vertical" />
          <a @click="handleEdit(scope.row)">合集属性</a>
          <el-divider direction="vertical" />
          <a @click="handleUpload(scope.row)">指南管理</a>
          <el-divider direction="vertical" />
          <el-popconfirm title="合集删除后不可恢复，是否确认删除？" @confirm="handleDelete(scope.row)">
            <a no-divider slot="reference"><span style="color: #e23322">删除合集</span></a>
          </el-popconfirm>
        </template>
      </dc-table>
      <!-- Table End -->
    </el-card>
    <collection-dialog ref="modalForm" @refresh="loadData" name="合集" />
    <guide-files-dialog ref="guideFilesDialog" @refresh="loadData" />
  </div>
</template>
<script>
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
import CollectionDialog from './components/collection/collection-dialog'
import GuideFilesDialog from './components/collection/guide-files-dialog.vue'
import { enableCollection } from '@/api/form'
export default {
  name: 'FormList',
  mixins: [DataCollectionMixin],
  components: { CollectionDialog, GuideFilesDialog },
  data() {
    return {
      url: {
        list: '/uc/api/formCollection/list',
        delete: '/uc/api/formCollection/delete'
      },
      searchItems: [
        { label: '年份', prop: 'year', options: [], type: 'select' },
        {
          label: '类型',
          prop: 'type',
          type: 'select',
          options: [
            { label: '教学基本状态数据', value: '教学基本状态数据' },
            { label: '其他数据', value: '其他数据' }
          ]
        },
        { label: '合集名称', prop: 'name', type: 'input' }
      ],
      columns: [
        { slot: 'name', label: '合集名称' },
        { prop: 'type', label: '合集类型' },
        { prop: 'year', label: '年份' },
        { slot: 'guidFiles', label: '填报指南' },
        { slot: 'enabled', label: '启用' },
        { slot: 'action', label: '操作', width: '350px' }
      ]
    }
  },
  watch: {
    dataSource: {
      immediate: true,
      handler() {
        let years = new Set()
        this.dataSource.forEach(data => years.add(data.year))
        this.searchItems[0].options = [...years].sort().map(item => {
          return { label: item, value: item }
        })
      }
    }
  },
  created() {
    this.loadData(1)
  },

  methods: {
    showCollectionDetail(row) {
      this.$router.push({
        path: '/form/detail',
        query: { collectionInfo: JSON.stringify(row) }
      })
    },

    enableCollection(val, row) {
      this.loading = true
      enableCollection({ id: row.id, enabledFlag: val })
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

    handleUpload(row) {
      this.$refs.guideFilesDialog.show(row)
    },

    downloadGuid(file) {
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = file.filePath
      link.setAttribute('download', file.name)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(file.filePath)
    }
  }
}
</script>

<style></style>
