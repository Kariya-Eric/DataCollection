<template>
  <a-modal
    title="复制表单"
    v-if="visible"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
    width="30%"
    destroyOnClose
  >
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="合集名称" prop="formCollectionId">
          <a-select v-model="model.formCollectionId" placeholder="请选择合集名称" allowClear>
            <a-select-option v-for="item in formCollectionList" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="表单名称" prop="formIds">
          <a-select v-model="model.formIds" mode="multiple" placeholder="请选择表单名称" @change="changeFormIds" allowClear>
            <a-select-opt-group>
              <span slot="label" class="checkItem"><a-checkbox v-model="checked" :indeterminate="indeterminate" @change="selectAll">全选</a-checkbox></span>
              <a-select-option v-for="item in formList" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { formCollectionList, getFormList, copyForm } from '@/api/form'
export default {
  name: 'FormCopyModal',
  mixins: [DataCollectionModalMixin],
  props: ['formId'],
  data() {
    return {
      formCollectionList: [],
      formList: [],
      checked: false,
      indeterminate: false,
      rules: {
        formCollectionId: [{ required: true, message: '请选择合集名称', trigger: 'change' }],
        formIds: [{ required: true, message: '请选择表单名称', trigger: 'change' }]
      }
    }
  },
  watch: {
    'model.formCollectionId'(val) {
      this.model.formIds = []
      this.checked = false
      this.indeterminate = false
      if (val) {
        this.getFormList(val)
      } else {
        this.formList = []
      }
    }
  },
  methods: {
    changeFormIds() {
      this.checked = this.model.formIds.length === this.formList.length
      this.indeterminate = this.model.formIds.length > 0 && this.model.formIds.length < this.formList.length
      this.$forceUpdate()
    },
    selectAll() {
      this.indeterminate = false
      this.model.formIds = this.checked ? this.formList.map(item => item.id) : []
    },

    getFormList(val) {
      let param = { id: val, searchParam: {} }
      getFormList(param).then(res => {
        if (res.state) {
          this.formList = res.value.rows
        }
      })
    },

    show() {
      this.getCollectionList()
      this.model = Object.assign({}, this.model)
      console.log(this.model)
      this.visible = true
    },

    getCollectionList() {
      this.loading = true
      formCollectionList({})
        .then(res => {
          if (res.state) {
            this.formCollectionList = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.model = {}
      this.$refs.form.clearValidate()
    },

    handleOk() {
      let that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          let param = {
            formCollectionId: this.formId,
            formIds: this.model.formIds.join(',')
          }
          that.loading = true
          copyForm(param)
            .then(res => {
              if (res.state) {
                that.$message.success(res.message)
                this.$emit('ok')
                this.close()
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => (that.loading = false))
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.checkItem {
  margin-left: 8px;
}
</style>
