<template>
  <div>
    <dc-dialog :visible.sync="visible" :title="title" @confirm="$refs.userForm.submit()" :disabled="loading" @close="$refs.userForm.resetFields()">
      <dc-form :form="userForm" :items="userFormItems" ref="userForm" @submit="submit" :loading="loading" />
    </dc-dialog>
  </div>
</template>

<script>
import { getUserDetail, addUser, updateUser } from '@/api/system/user'
export default {
  name: 'UserDialog',
  props: ['roles', 'depts', 'departId', 'name'],
  data() {
    return {
      updateFlag: false,
      loading: false,
      visible: false,
      title: '',
      userForm: {},
      userFormItems: [
        { prop: 'account', label: '账号', required: true, type: 'input' },
        { prop: 'name', label: '姓名', required: true, type: 'input' },
        { prop: 'orgId', label: '所属部门', required: true, type: 'select', options: [], group: true },
        { prop: 'roleIds', label: '角色', required: true, type: 'select', multiple: true, options: [] },
        { prop: 'email', label: '邮箱', type: 'input', prefix: 'el-icon-message', rules: [{ type: 'email', message: '请输入正确的邮箱地址' }] },
        {
          prop: 'mobile',
          label: '手机',
          type: 'input',
          prefix: 'el-icon-mobile',
          rules: [
            {
              validator: (rule, value, callback) => {
                if (value) {
                  if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(value)) {
                    callback(new Error('清输入正确的手机号'))
                  }
                }
                callback()
              },
              trigger: ['blur', 'change']
            }
          ]
        },
        { prop: 'status', label: '状态', type: 'switch', number: true }
      ]
    }
  },
  watch: {
    roles: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          let item = this.userFormItems.find(item => item.prop == 'roleIds')
          item.options = newVal
        }
      }
    },
    depts: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          let item = this.userFormItems.find(item => item.prop == 'orgId')
          item.options = newVal
        }
      }
    }
  },

  methods: {
    initData(id) {
      this.loading = true
      getUserDetail(id)
        .then(res => {
          if (res.state) {
            this.userForm = res.value
            this.$nextTick(() => this.$refs.userForm.reset())
          }
        })
        .finally(() => (this.loading = false))
    },

    add() {
      this.loading = true
      this.userFormItems.forEach(item => (item.disabled = false))
      this.userForm = { ...this.userForm, status: 1 }
      this.$nextTick(() => this.$refs.userForm.reset())
      this.loading = false
      this.updateFlag = false
      this.visible = true
    },

    info(record) {
      this.userFormItems.forEach(item => (item.disabled = true))
      this.initData(record.id)
      this.visible = true
    },

    edit(record) {
      this.userFormItems.forEach((item, index) => (item.disabled = index === 0))
      this.initData(record.id)
      this.updateFlag = true
      this.visible = true
    },

    submit(flag) {
      if (flag) {
        if (this.updateFlag) {
          this.handleUpdate()
        } else {
          this.handleAdd()
        }
      }
    },

    handleUpdate() {
      this.loading = true
      updateUser(this.userForm)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .finally(() => (this.loading = false))
    },

    handleAdd() {
      this.loading = true
      let param = { ...this.userForm, password: '123456' }
      addUser(param)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
            this.visible = false
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped lang="scss"></style>
