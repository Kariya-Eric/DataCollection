<template>
  <a-modal
    title="设置选项来源"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
    width="35%"
    destroyOnClose
  >
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="年份" prop="year">
          <dc-select v-model="model.year" placeholder="请选择年份" @change="val => initDictionary(val)" :options="yearList" :fields="{}" />
        </a-form-model-item>
        <a-form-model-item label="类型" prop="type">
          <dc-select
            v-model="model.type"
            placeholder="请选择类型"
            :options="[
              { name: '教学基本状态数据', id: '教学基本状态数据' },
              { name: '其他数据', id: '其他数据' }
            ]"
          />
        </a-form-model-item>
        <a-form-model-item label="表单名称" prop="name">
          <dc-select v-model="model.name" placeholder="请选择表单名称" @change="val => getOptionData(val)" :options="formData" />
        </a-form-model-item>
        <a-form-model-item label="选项" prop="option">
          <dc-select v-model="model.option" placeholder="请选择选项" @change="val => getOptionValueData(val)" :options="optionData" />
        </a-form-model-item>
      </a-form-model>
      <a-divider>选项值</a-divider>
      <a-table bordered rowKey="id" :columns="columns" :data-source="optionValueData" :pagination="false" :scroll="{ y: 380 }"></a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getDictionaryTree, listAll } from '@/api/system/option'
export default {
  name: 'OptionModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      columns: [
        { title: '序号', width: 70, align: 'center', key: 'rowIndex', customRender: (t, r, index) => parseInt(index) + 1 },
        { title: '选项值', align: 'center', dataIndex: 'name' }
      ],
      rules: {
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        name: [{ required: true, message: '请选择表单名称', trigger: 'change' }],
        option: [{ required: true, message: '请选择选项', trigger: 'change' }]
      },
      formData: [],
      optionData: [],
      tempFormData: [],
      optionValueData: []
    }
  },
  computed: {
    yearList() {
      let startYear = 2018
      let nowYear = new Date().getFullYear()
      let years = []
      for (let i = nowYear; i >= startYear; i--) {
        years.push(i)
      }
      return years
    }
  },
  watch: {
    'model.type': {
      handler(newVal) {
        this.model = Object.assign({}, { year: this.model.year, type: newVal })
        this.optionData = []
        this.optionValueData = []
        if (newVal) {
          this.formData = this.tempFormData.filter(item => item.parentId == newVal)
        } else {
          this.formData = []
        }
      },
      immediate: true
    }
  },

  methods: {
    show() {
      this.visible = true
    },

    getOptionData(val) {
      this.model.option = ''
      this.optionValueData = []
      this.optionData = []
      if (val) {
        this.loading = true
        listAll({ parentId: val, year: this.model.year })
          .then(res => {
            if (res.state) {
              this.$nextTick(() => {
                this.optionData = res.value.map(item => {
                  let newItem = { ...item }
                  delete newItem.children
                  return newItem
                })
              })
            }
          })
          .finally(() => (this.loading = false))
      }
    },

    getOptionValueData(val) {
      this.optionValueData = []
      if (val) {
        this.loading = true
        listAll({ parentId: val, year: this.model.year })
          .then(res => {
            if (res.state) {
              this.$nextTick(() => {
                this.optionValueData = res.value.map(item => {
                  let newItem = { ...item }
                  delete newItem.children
                  return newItem
                })
              })
            }
          })
          .finally(() => (this.loading = false))
      }
    },

    initDictionary(year) {
      this.model = Object.assign({}, { year })
      this.formData = []
      this.optionData = []
      this.tempFormData = []
      this.optionValueData = []
      if (year) {
        this.loading = true
        getDictionaryTree(year)
          .then(res => {
            if (res.state) {
              let options = []
              this.renderTreeData(res.value, options)
              this.$nextTick(() => (this.tempFormData = options))
            }
          })
          .finally(() => (this.loading = false))
      }
    },

    renderTreeData(treeData, options) {
      treeData.forEach(tree => {
        if (tree.children || tree.children.length > 0) {
          this.renderTreeData(tree.children, options)
        }
        if (tree.type == 'FormCollection') {
          options.push(tree)
        }
      })
    },

    close() {
      this.visible = false
      this.$emit('close')
      this.$refs.form.clearValidate()
      this.model = {}
      this.formData = []
      this.optionData = []
      this.tempFormData = []
      this.optionValueData = []
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('setOption', this.optionValueData)
          this.close()
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
