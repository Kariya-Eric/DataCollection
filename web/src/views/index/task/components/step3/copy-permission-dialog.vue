<template>
  <dc-dialog title="配置权限" :visible.sync="visible" width="30%" :disabled="loading" :append-to-body="true" @confirm="$refs.permissionForm.submit()">
    <dc-form :form="permissionForm" ref="permissionForm" label-width="80px" :items="items" :loading="loading" @submit="handleSubmit" />
  </dc-dialog>
</template>

<script>
import { taskList, copyAuthority } from '@/api/task'
export default {
  name: 'CopyPermissionDialog',
  props: ['taskId'],
  data() {
    return {
      visible: false,
      loading: false,
      taskList: [],
      permissionForm: {},
      items: [{ type: 'select', label: '任务名称', options: [], required: true, prop: 'sourceId' }]
    }
  },
  mounted() {
    this.getTaskList()
  },

  methods: {
    getTaskList() {
      taskList({}).then(res => {
        if (res.state) {
          this.taskList = res.value.rows.filter(row => row.id != this.taskId)
        }
      })
    },

    show() {
      this.items[0].options = this.taskList
      this.permissionForm = Object.assign({}, this.permissionForm)
      this.$nextTick(() => this.$refs.permissionForm.reset())
      this.visible = true
    },

    handleSubmit(flag) {
      if (flag) {
        let param = {
          taskId: this.taskId,
          sourceTaskId: this.permissionForm.sourceId
        }
        copyAuthority(param).then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.visible = false
            this.$emit('close')
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
}
</script>

<style></style>
