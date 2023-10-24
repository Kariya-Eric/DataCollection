<template>
  <a-modal title="设置选项来源" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="35%">
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="年份" prop="year">
          <a-select v-model="model.year" placeholder="请选择年份">
            <a-select-option value="2022">2022</a-select-option>
            <a-select-option value="2021">2021</a-select-option>
            <a-select-option value="2020">2020</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单名称" prop="name">
          <a-select v-model="model.name" placeholder="请选择表单名称">
            <a-select-option v-for="item in formData" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选项" prop="option">
          <a-select v-model="model.option" placeholder="请选择选项">
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
        { title: '选项名', align: 'center', dataIndex: 'label' },
        { title: '选项值', align: 'center', dataIndex: 'value' }
      ],
      rules: {
        name: [{ required: true, message: '请选择表单名称', trigger: 'change' }],
        option: [{ required: true, message: '请选择选项' }]
      },
      formData: [],
      optionData: [],
      optionValueData: []
    }
  },
  methods: {
    show() {
      this.visible = true
    },

    initDictionary() {
      this.loading = true
      getDictionaryTree()
        .then(res => {
          if (res.state) {
            this.renderTreeData(res.value)
          }
        })
        .finally(() => (this.loading = false))
    },

    renderTreeData(treeData) {
        
    },

    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('setOption', this.selectionRows)
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
