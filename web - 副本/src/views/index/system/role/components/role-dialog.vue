<template>
  <div>
    <dc-dialog :title="title" :visible.sync="visible" @confirm="$refs.roleForm.submit()" @close="$refs.roleForm.resetFields()" width="30%" :disabled="loading">
      <dc-form ref="roleForm" @submit="submit" :items="items" :form="roleForm" :loading="loading" />
    </dc-dialog>
  </div>
</template>

<script>
import { addRole, updateRole } from '@/api/system'
export default {
  name: 'RoleDialog',
  props: ['name'],
  data() {
    return {
      loading: false,
      visible: false,
      title: '',
      roleForm: {},
      items: [
        { label: '角色编码', prop: 'code', type: 'input', required: true },
        { label: '角色名称', prop: 'name', type: 'input', required: true },
        { label: '状态', prop: 'enabled', type: 'switch', number: true }
      ]
    }
  },

  methods: {
    submit(flag) {
      if (flag) {
        if (this.updateFlag) {
          this.handleUpdate()
        } else {
          this.handleAdd()
        }
      }
    },

    add() {
      this.roleForm = { ...this.roleForm, enabled: 1 }
      this.items.forEach(item => {
        if (item.prop == 'code') item.disabled = false
      })
      this.$nextTick(() => this.$refs.roleForm.reset())
      this.updateFlag = false
      this.visible = true
    },

    edit(record) {
      this.roleForm = Object.assign({}, record)
      this.items.forEach(item => {
        if (item.prop == 'code') item.disabled = true
      })
      this.$nextTick(() => this.$refs.roleForm.reset())
      this.updateFlag = true
      this.visible = true
    },

    handleSubmit() {
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          if (this.addFlag) {
            this.handleAdd()
          } else {
            this.handleUpdate()
          }
        }
      })
    },

    handleAdd() {
      this.loading = true
      addRole(this.roleForm)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleUpdate() {
      this.loading = true
      updateRole(this.roleForm)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.formDiv {
  margin: 0 24px;
}
</style>
