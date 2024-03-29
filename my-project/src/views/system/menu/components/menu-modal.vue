<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" :model="model" v-bind="layout" :rules="rules">
        <a-form-model-item label="菜单名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入菜单名称" allowClear />
        </a-form-model-item>
        <a-form-model-item label="上级菜单" prop="parentId" :hidden="!hasParent">
          <a-tree-select
            :getPopupContainer="target => target.parentNode"
            v-model="model.parentId"
            show-search
            placeholder="请选择上级菜单"
            allow-clear
            tree-default-expand-all
            :tree-data="menu"
            :replace-fields="replaceFields"
            :filterTreeNode="filterTreeNode"
            :dropdown-style="{ maxHeight: '320px', overflow: 'auto' }"
          />
        </a-form-model-item>
        <a-form-model-item label="别名" prop="alias">
          <a-input v-model="model.alias" placeholder="请输入别名" allowClear />
        </a-form-model-item>
        <a-form-model-item label="URL" prop="menuUrl">
          <a-input v-model="model.menuUrl" placeholder="请输入URL" allowClear />
        </a-form-model-item>
        <a-form-model-item label="模板URL" prop="templateUrl">
          <a-input v-model="model.templateUrl" placeholder="请输入模板URL" allowClear />
        </a-form-model-item>
        <a-form-model-item label="排序" prop="sn">
          <a-input-number v-model="model.sn" placeholder="请输入排序" :min="0" style="width: 40%" />
        </a-form-model-item>
        <a-form-model-item label="在菜单中显示" :label-col="labelCol" :wrapper-col="wrapperCol">
          <dc-switch v-model="model.enableMenu" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { saveMenu } from '@/api/system/menu'
export default {
  name: 'MenuModal',
  mixins: [DataCollectionModalMixin],
  props: ['menu'],
  data() {
    return {
      labelCol: { style: 'width: 120px; display: inline-block;vertical-align: inherit;' },
      wrapperCol: { style: 'width: calc(100% - 120px); display: inline-block;' },
      hasParent: false,
      rules: {
        name: [{ required: true, message: '请输入菜单名称' }],
        parentId: [{ required: true, message: '请选择上级菜单' }],
        alias: [{ required: true, message: '请输入别名' }],
        menuUrl: [{ required: true, message: '请输入Url' }],
        templateUrl: [{ required: true, message: '请输入模板Url' }],
        sn: [{ required: true, message: '请输入排序' }]
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
    show(hasParent, title, parentId) {
      this.title = title
      this.hasParent = hasParent
      if (parentId) {
        this.model = Object.assign({}, { enableMenu: 1, parentId })
      } else {
        this.model = Object.assign({}, { enableMenu: 1 })
      }
      this.visible = true
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          saveMenu(this.model)
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('ok')
                this.close()
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => (this.loading = false))
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
/deep/.ant-select-dropdown {
  top: 32px !important;
}
</style>
