<template>
  <div>
    <dc-dialog :visible.sync="visible" :title="title" @confirm="$refs.userForm.submit()" :disabled="loading">
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
      loading: false,
      visible: false,
      title: '',
      userForm: {},
      userFormItems: [
        { prop: 'account', label: '账号', required: true, type: 'input' },
        { prop: 'name', label: '姓名', required: true, type: 'input' },
        { prop: 'orgId', label: '所属部门', required: true, type: 'select' },
        { prop: 'roleIds', label: '角色', required: true, type: 'select', multiple: true },
        { prop: 'email', label: '邮箱', type: 'input', prefix: 'el-icon-message' },
        { prop: 'mobile', label: '手机', type: 'input', prefix: 'el-icon-mobile' },
        { prop: 'status', label: '状态', type: 'switch', number: true }
      ]
    }
  },

  mounted() {
    this.$set(this.userFormItems[2], 'options', this.depts)
    this.$set(this.userFormItems[3], 'options', this.roles)
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
      this.userFormItems = this.userFormItems.map(item => {
        return { ...item, disabled: false }
      })
      this.userForm = Object.assign({}, { status: 1 })
      this.$nextTick(() => this.$refs.userForm.reset())
      this.loading = false
      this.visible = true
    },

    info(record) {
      this.userFormItems = this.userFormItems.map(item => {
        return { ...item, disabled: true }
      })
      this.initData(record.id)
      this.visible = true
    },

    edit(record) {
      this.userFormItems = this.userFormItems.map((item, index) => {
        if (index === 0) {
          return { ...item, disabled: true }
        }
        return { ...item, disabled: false }
      })
      this.initData(record.id)
      this.visible = true
    },

    submit(flag) {}
  }
}
</script>

<style scoped lang="scss"></style>
