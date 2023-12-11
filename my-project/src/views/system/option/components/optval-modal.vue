<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="选项名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input v-model="parentName" disabled />
        </a-form-model-item>
        <a-form-model-item label="选项值名称" prop="name" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input placeholder="请输入选项值名称" v-model="model.name" allowClear />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { addOption, updateOption } from '@/api/system/option'
export default {
  name: 'OptvalModal',
  mixins: [DataCollectionModalMixin],
  props: ['parentName'],
  data() {
    return {
      labelCol: { style: 'width: 100px; display: inline-block;vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 100px); display: inline-block;' },
      rules: {
        name: [{ required: true, message: '请输入选项值名称' }]
      },
      addFlag: false
    }
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.addFlag) {
            addOption(this.model)
              .then(res => {
                if (res.state) {
                  this.$message.success(res.message)
                  this.$emit('refresh')
                  this.close()
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
                  this.$emit('refresh')
                  this.close()
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

    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },
    add(parentId, searchYear) {
      this.edit({}, '添加选项值', parentId, searchYear)
    },
    edit(record, title, parentId, searchYear) {
      this.title = title
      if (!record.sort) {
        record.sort = 0
      }
      if (record.name) {
        this.addFlag = false
      } else {
        this.addFlag = true
      }
      this.model = Object.assign({}, { ...record, parentId: parentId[0], year: searchYear })
      this.visible = true
    }
  }
}
</script>

<style></style>
