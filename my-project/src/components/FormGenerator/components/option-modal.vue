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
            <a-select-option value="2022">1-1.学校概况</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="选项" prop="option">
          <a-radio-group button-style="solid" v-model="model.option">
            <a-radio-button value="a"> 办学类型 </a-radio-button>
            <a-radio-button value="b"> 学校性质 </a-radio-button>
            <a-radio-button value="c"> 举办者 </a-radio-button>
            <a-radio-button value="d"> 主管部门 </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
      <a-divider>选项值</a-divider>
      <a-table
        bordered
        rowKey="id"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: 380 }"
      ></a-table>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
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
      selectedRowKeys: [],
      selectionRows: [],
      rules: {
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        name: [{ required: true, message: '请选择表单名称', trigger: 'change' }],
        option: [{ required: true, message: '请选择选项' }]
      },
      data: []
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },

    show() {
      this.visible = true
      for (let i = 0; i < 20; i++) {
        this.data.push({ label: '选项值_' + (i + 1), value: i + 1 })
      }
    },

    close() {
      this.model = {}
      this.selectedRowKeys = []
      this.data = []
      this.selectionRows = []
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.selectedRowKeys.length == 0) {
            this.$message.warning('请至少选择一条数据！')
            return
          } else {
            this.$emit('setOption', this.selectionRows)
            this.close()
          }
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
