<template>
  <a-modal title="配置表单大类" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="30%">
    <a-form-model>

    </a-form-model>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'FormCategoryModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入合集名称' }],
        type: [{ required: true, message: '请选择合集类型' }],
        year: [{ required: true, message: '请选择年份' }]
      }
    }
  },
  methods: {

    show(formCategory) {
      this.categoryForm = { ...formCategory, ...this.categoryForm }
      this.loadFormCategory()
      this.visible = true
    },

    
    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    handleOk() {

    }
  }
}
</script>

<style scoped lang="less"></style>
