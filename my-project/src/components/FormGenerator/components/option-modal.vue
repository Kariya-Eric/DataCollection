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
          <a-select v-model="model.year" placeholder="请选择年份" @change="val => initDictionary(val)">
            <a-select-option v-for="(year, i) in yearList" :key="i" :value="year">{{ year }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单名称" prop="name">
          <a-select v-model="model.name" placeholder="请选择表单名称" @change="val => getOptionData(val)">
            <a-select-option v-for="item in formData" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选项" prop="option">
          <a-select v-model="model.option" placeholder="请选择选项" @change="val => getOptionValueData(val)">
            <a-select-option v-for="item in optionData" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
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
        name: [{ required: true, message: '请选择表单名称', trigger: 'change' }],
        option: [{ required: true, message: '请选择选项' }]
      },
      formData: [],
      optionData: [],
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
  methods: {
    show() {
      this.visible = true
    },

    getOptionData(val) {
      this.loading = true
      listAll(val)
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
    },

    getOptionValueData(val) {
      this.loading = true
      listAll(val)
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
    },

    initDictionary(year) {
      this.loading = true
      getDictionaryTree(year)
        .then(res => {
          if (res.state) {
            let options = []
            this.renderTreeData(res.value, options)
            this.$nextTick(() => (this.formData = options))
          }
        })
        .finally(() => (this.loading = false))
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
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
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
