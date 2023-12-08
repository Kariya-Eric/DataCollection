<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="上级选项" prop="parentId" :hidden="!hasParent">
          <a-tree-select
            :getPopupContainer="target => target.parentNode"
            v-model="model.parentId"
            show-search
            placeholder="请选择上级选项（非必选）"
            allow-clear
            tree-default-expand-all
            :tree-data="treeData"
            :replace-fields="replaceFields"
            :filterTreeNode="filterTreeNode"
            :dropdown-style="{ maxHeight: '320px', overflow: 'auto' }"
          />
        </a-form-model-item>
        <a-form-model-item label="选项值" prop="name">
          <a-input v-model="model.name" placeholder="请输入选项值" allowClear></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { addOption, updateOption } from '@/api/system/option'
export default {
  name: 'OptionModal',
  mixins: [DataCollectionModalMixin],
  props: ['treeData'],
  data() {
    return {
      hasParent: false,
      rules: {
        name: [{ required: true, message: '请输入选项值' }]
      },
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      filterTreeNode: (inputValue, treeNode) => treeNode.data.props.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
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
    add() {
      this.edit({}, '添加目录')
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    edit(record, title) {
      if (!record.sort) {
        record.sort = 0
      }
      this.model = Object.assign({}, record)
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
