<template>
  <div>
    <div class="title">
      <span class="title-icon">&nbsp;&nbsp;{{ collectionDetail.year }}</span>
      <span class="title-name"> {{ collectionDetail.name }}</span>
      <a-button style="float: right" @click="$router.back(-1)"><dc-icon type="icon-dc_back" />返回</a-button>
    </div>
    <a-card>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="4" :sm="12">
              <a-form-item label="表单大类">
                <a-select v-model="queryParam.formCategories" placeholder="请选择表单大类" allowClear>
                  <a-select-option v-for="item in listCategories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="前置表单">
                <a-select v-model="queryParam.type" placeholder="请选择前置表单" allowClear> </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="12">
              <a-form-item label="表单名称">
                <a-input v-model="queryParam.name" placeholder="请输入表单名称" allowClear> </a-input>
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
        <span>合集详情</span>
        <div class="table-operator-button">
          <a-button type="primary" @click="updateFormCategory"><dc-icon type="icon-dc_config_category" />配置表单大类</a-button>
          <a-button type="primary" @click="copyForm"><dc-icon type="icon-dc_copy" />复制表单</a-button>
          <a-button type="primary" @click="handleAdd('新建表单')"><dc-icon type="icon-dc_new" />新建表单</a-button>
        </div>
      </div>

      <div>
        <a-table bordered rowKey="id" :dataSource="dataSource" :pagination="ipagination" :loading="loading" :columns="columns" @change="handleTableChange">
          <template slot="required" slot-scope="text, record">
            {{ record.required ? `是` : `否` }}
          </template>
          <template slot="type" slot-scope="text, record">
            <a-tag :class="record.type == '固定表单' ? 'fixed-tag' : 'float-tag'">
              <span :style="{ color: record.type == '固定表单' ? '#2b9e77' : '#2f68bd' }">{{ record.type }}</span>
            </a-tag>
          </template>
          <template slot="enabled" slot-scope="text, record">
            <dc-switch v-model="record.enabledFlag" @change="val => enableForm(val, record.id)" />
          </template>
          <template slot="action" slot-scope="text, record">
            <a @click="showForm(record)">表单详情</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record, '表单属性')">表单属性</a>
            <a-divider type="vertical" />
            <a-popconfirm title="表单删除后不可恢复，是否确认删除？" @confirm="handleDelete(record.id)">
              <a><span style="color: #e23322">删除表单</span></a>
            </a-popconfirm>
          </template>
        </a-table>
      </div>
    </a-card>
    <form-modal ref="modalForm" :collection="collectionDetail" :categories="listCategories" @ok="refreshData" />
    <form-generator-modal ref="formGeneratorModal" :categories="listCategories" @refresh="refreshData" :formList="dataSource" />
    <form-copy-modal ref="formCopyModal" :formId="collectionDetail.id" @ok="refreshData" />
    <form-category-modal ref="formCategoryModal" @ok="refreshData" />
  </div>
</template>

<script>
const listUrl = '/uc/api/form/listByCollection/'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import { listFormCategories, enableForm } from '@/api/form'
import FormModal from './components/form/form-modal.vue'
import FormGeneratorModal from './components/formDesign/form-generator-modal.vue'
import FormCopyModal from './components/form/form-copy-modal.vue'
import FormCategoryModal from './components/form/form-category-modal.vue'
export default {
  name: 'FormDetail',
  components: { FormModal, FormGeneratorModal, FormCopyModal, FormCategoryModal },
  mixins: [DataCollectionListMixin],
  data() {
    return {
      url: {
        list: '',
        delete: '/uc/api/form/delete'
      },
      listCategories: [],
      collectionDetail: {},
      columns: [
        { dataIndex: 'name', title: '表单名称', align: 'center', scopedSlots: { customRender: 'name' } },
        { dataIndex: 'formCategoriesName', title: '表单大类', align: 'center' },
        { dataIndex: 'collectTimeType', title: '统计时间类型', align: 'center' },
        { title: '表单类型', align: 'center', scopedSlots: { customRender: 'type' } },
        { title: '是否必填', align: 'center', scopedSlots: { customRender: 'required' } },
        { dataIndex: 'a', title: '前置表单', align: 'center' },
        { title: '启用', align: 'center', scopedSlots: { customRender: 'enabled' } },
        { title: '操作', width: 340, align: 'center', scopedSlots: { customRender: 'action' } }
      ]
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'formDetail') {
          this.collectionDetail = JSON.parse(newRoute.query.collectionInfo)
          this.refreshData(1)
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    updateFormCategory() {
      this.$refs.formCategoryModal.show(this.collectionDetail)
    },

    copyForm() {
      this.$refs.formCopyModal.show()
    },

    refreshData(args) {
      this.loadCategories()
      this.url.list = listUrl + this.collectionDetail.id
      this.loadData(args)
    },

    loadCategories() {
      listFormCategories(this.collectionDetail.id).then(res => {
        if (res.state) {
          this.listCategories = res.value
            .sort((a, b) => a.sort - b.sort)
            .map(item => ({
              ...item,
              name: item.sort + 1 + '.' + item.name
            }))
        }
      })
    },

    enableForm(val, id) {
      let param = { id, enabledFlag: val }
      this.loading = true
      enableForm(param)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.refreshData()
          this.loading = false
        })
    },

    showForm(record) {
      this.$refs.formGeneratorModal.show(record)
    }
  }
}
</script>

<style scoped lang="less">
.title {
  margin-bottom: 24px;
  .title-icon {
    display: inline-block;
    width: 56px;
    height: 22px;
    background: linear-gradient(360deg, #2f68bd 0%, #76a8f4 100%);
    border-radius: 40px 2px 40px 2px;
    color: #ffffff;
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
    margin-right: 10px;
    margin-left: 12px;
  }
  .title-name {
    color: #000;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
