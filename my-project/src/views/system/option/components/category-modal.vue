<template>
  <a-modal :title="title" :visible="visible" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="年份" prop="year">
          <a-input disabled v-model="model.year" />
        </a-form-model-item>
        <a-form-model-item label="类型" prop="parentId">
          <a-select v-model="model.parentId" placeholder="请选择类型">
            <a-select-option value="教学基本状态数据">教学基本状态数据</a-select-option>
            <a-select-option value="其他数据">其他数据</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="目录名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入目录名称" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sort" v-if="!hasParent">
          <a-input-number v-model="model.sort" placeholder="请输入排序" style="width: 30%"></a-input-number>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { addOption, updateOption } from '@/api/system/option'
export default {
  name: 'CategoryModal',
  mixins: [DataCollectionModalMixin],
  props: ['treeData'],
  data() {
    return {
      hasParent: false,
      rules: {
        parentId: [{ required: true, message: '请选择类型' }],
        name: [{ required: true, message: '请输入目录名称' }]
      }
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.hasParent) {
            addOption(this.model)
              .then(res => {
                if (res.state) {
                  this.$message.success(res.message)
                  this.close()
                  this.$emit('refresh')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          } else {
            updateOption(this.model)
              .then(res => {
                if (res.state) {
                  this.$message.success(res.message)
                  this.close()
                  this.$emit('refresh')
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                this.loading = false
              })
          }
        }
      })
    },
    add(year) {
      this.edit({}, '添加目录', year)
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    edit(record, title, year) {
      if (!record.sort) {
        record.sort = 0
      }
      this.model = Object.assign({}, { ...record, year: year })
      this.title = title
      this.hasParent = this.title.indexOf('添加') > -1
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-select-dropdown {
  top: 32px !important;
}
</style>
