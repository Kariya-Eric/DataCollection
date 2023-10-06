<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false">
    <a-spin :spinning="loading"> <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules"> </a-form-model></a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'FormModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {}
    }
  },

  methods: {
    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
    },

    handleOk() {}
  }
}
</script>

<style scoped lang="less"></style>
