<template>
  <a-modal
    title="批量编辑选项值"
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
      <a-alert message="选项值与选项值之间用换行分隔" type="info" style="margin-bottom: 8px" show-icon> </a-alert>
      <a-textarea placeholder="请输入选项值名称" v-model="options" :rows="6" />
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { saveList } from '@/api/system/option'
export default {
  name: 'OptvalBatchModal',
  mixins: [DataCollectionModalMixin],
  props: ['year'],
  data() {
    return {
      options: '',
      parentId: ''
    }
  },
  methods: {
    show(dataSource, parentId) {
      this.parentId = parentId[0]
      this.options = dataSource.map(item => item.name).join('\n')
      this.visible = true
    },

    close() {
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      let opts = this.options.split('\n').map((item, index) => {
        let opt = { parentId: this.parentId, name: item, sort: index + 1, year: this.year }
        return opt
      })
      this.loading = true
      saveList({ data: opts, id: this.parentId })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.close()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style></style>
