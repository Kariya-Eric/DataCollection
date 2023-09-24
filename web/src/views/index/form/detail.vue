<template>
  <div>
    <span class="card-title">
      <span class="titleYear">&nbsp;&nbsp;{{ collectionDetail.year }}</span>
      {{ collectionDetail.name }}
    </span>
    <el-card shadow="always" class="app-card" style="margin-top: 16px">
      <dc-search :items="searchItems" label-width="80px" :form="queryParam" okText="搜索" cancelText="重置" @submit="searchQuery" @cancel="searchReset" />

      <div class="list-header">
        <span>合集详情</span>
        <div class="list-header-button">
          <el-button @click="updateFormCategory" type="primary"><svg-icon icon-class="配置大类" /> 配置表单大类</el-button>
          <el-button type="primary" @click="copyForm"><svg-icon icon-class="复制" /> 复制表单</el-button>
          <el-button @click="handleAdd" type="primary"><svg-icon icon-class="新建" /> 新建表单</el-button>
        </div>
      </div>

      <dc-table
        @selection-change="onSelectChange"
        :data="dataSource"
        :columns="columns"
        :pagination="ipagination"
        selection="selection"
        @change="loadData"
        v-loading="loading"
      >
        <template slot="name" slot-scope="scope">
          <a href="javascript:;" @click="showForm(scope.row)">{{ scope.row.name }}</a>
        </template>
        <template slot="type" slot-scope="scope">
          <el-tag size="medium" :class="`tag${scope.row.type === '固定表单' ? 'Fix' : 'Float'}`">{{ scope.row.type }}</el-tag>
        </template>
        <template slot="required" slot-scope="scope">
          {{ scope.row.required ? `是` : `否` }}
        </template>
        <template slot="enabled" slot-scope="scope">
          <el-switch v-model="scope.row.enabledFlag" :inactive-value="0" :active-value="1" @change="val => enableForm(val, scope.row)" />
        </template>
        <template slot="action" slot-scope="scope">
          <a href="javascript:;" @click="showForm(scope.row)">表单详情</a>
          <el-divider direction="vertical" />
          <a href="javascript:;" k @click="handleEdit(scope.row)">表单属性</a>
          <el-divider direction="vertical" />
          <a href="javascript:;">下载模板</a>
          <el-divider direction="vertical" />
          <el-popconfirm title="表单删除后不可恢复，是否确认删除？" @confirm="handleDelete(scope.row)">
            <a href="javascript:;" no-divider slot="reference"><span style="color: #e23322">删除表单</span></a>
          </el-popconfirm>
        </template>
      </dc-table>
    </el-card>
    <form-dialog ref="modalForm" @refresh="loadData" :collection="collectionDetail" :categorys="listCategories" name="表单" />
    <form-category-dialog ref="formCategoryDialog" @refresh="loadCategories" />
    <form-generator-dialog ref="formGeneratorDialog" @refresh="loadData" :categories="listCategories" />
    <copy-form-dialog ref="copyFormDialog" :formId="collectionDetail.id" @refresh="loadData" />
  </div>
</template>

<script>
import FormDialog from './components/form/form-dialog'
import FormCategoryDialog from './components/form/form-category-dialog'
import { updateForm, listFormCategories, enableForm } from '@/api/form'
import FormGeneratorDialog from './components/formDesign/form-generator-dialog.vue'
import CopyFormDialog from './components/form/copy-form-dialog.vue'
import { DataCollectionMixin } from '@/mixins/DataCollectionMixins'
export default {
  name: 'FormDetail',
  mixins: [DataCollectionMixin],
  components: {
    FormDialog,
    FormCategoryDialog,
    FormGeneratorDialog,
    CopyFormDialog
  },
  data() {
    return {
      searchItems: [
        { type: 'select', label: '表单大类', prop: 'formCategories', options: [] },
        {
          type: 'select',
          label: '前置表单',
          prop: 'type',
          options: []
        },
        { type: 'input', label: '表单名称', prop: 'name' }
      ],
      columns: [
        { slot: 'name', label: '表单名称' },
        { prop: 'formCategoriesName', label: '表单大类' },
        { prop: 'collectTimeType', label: '统计时间类型' },
        { slot: 'type', label: '表单类型' },
        { slot: 'required', label: '是否必填' },
        { prop: 'a', label: '前置表单' },
        { slot: 'enabled', label: '启用' },
        { slot: 'action', label: '操作', width: '350px' }
      ],
      collectionDetail: {},
      url: {
        list: '',
        delete: '/uc/api/form/delete'
      },
      listUrl: '/uc/api/form/listByCollection/',
      listCategories: [],
      formInfo: {},
      drawingList: []
    }
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'formDetail') {
          this.collectionDetail = JSON.parse(newRoute.query.collectionInfo)
          this.url.list = this.listUrl + this.collectionDetail.id
          this.loadCategories()
          this.loadData(1)
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    loadCategories() {
      listFormCategories(this.collectionDetail.id).then(res => {
        if (res.state) {
          this.listCategories = res.value
            .sort((a, b) => a.sort - b.sort)
            .map(item => ({
              ...item,
              name: item.sort + 1 + '.' + item.name
            }))
          this.searchItems[0].options = this.listCategories
        }
      })
    },

    updateFormCategory() {
      this.$refs.formCategoryDialog.show(this.collectionDetail)
    },

    showForm(row) {
      this.$refs.formGeneratorDialog.show(row)
    },

    saveForm(formData, formInfo) {
      const { fields } = formData
      Reflect.deleteProperty(formData, 'fields')
      Reflect.deleteProperty(formData, 'formBtns')
      const params = {
        ...formInfo,
        formProperties: JSON.stringify(formData),
        componentProperties: JSON.stringify(fields)
      }
      this.loading = true
      updateForm(params)
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
    goBack() {
      this.$router.go(-1)
    },

    enableForm(val, row) {
      let param = { id: row.id, enabledFlag: val }
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
          this.loadData()
          this.loading = false
        })
    },

    copyForm() {
      this.$refs.copyFormDialog.show()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag {
  border-radius: 13px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
}
.tagFloat {
  color: #2f68bd;
  background-color: #e7f2ff;
  border-color: #2f68bd;
}
.tagFix {
  color: #2b9e77;
  background-color: #e7f7ec;
  border-color: #2b9e77;
}

.titleYear {
  display: inline-block;
  width: 54px;
  height: 22px;
  background: linear-gradient(360deg, #2f68bd 0%, #76a8f4 100%);
  border-radius: 40px 2px 40px 2px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  line-height: 22px;
  margin-right: 10px;
}
</style>
