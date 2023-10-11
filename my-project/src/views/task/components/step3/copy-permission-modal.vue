<template>
  <a-modal title="复制任务权限" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false">
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item prop="sourceId" label="任务名称">
          <a-select v-model="model.sourceId" allowClear placeholder="请选择任务名称">
            <a-select-option v-for="item in taskList" :value="item.id" :key="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { taskList, copyAuthority } from '@/api/task'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'CopyPermissionModal',
  mixins: [DataCollectionModalMixin],
  props: ['taskId'],
  data() {
    return {
      rules: {
        sourceId: [{ required: true, message: '请选择任务名称' }]
      },
      taskList: []
    }
  },
  mounted() {
    this.getTaskList()
  },

  methods: {
    getTaskList() {
      this.loading = true
      taskList({})
        .then(res => {
          if (res.state) {
            this.taskList = res.value.rows.filter(row => row.id != this.taskId)
          }
        })
        .finally(() => (this.loading = false))
    },

    show() {
      this.model = Object.assign({}, this.model)
      this.visible = true
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
          let param = {
            taskId: this.taskId,
            sourceTaskId: this.model.sourceId
          }
          copyAuthority(param).then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.close()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style></style>
