<template>
  <div class="form">
    <dc-form ref="form" :items="items" :form="form" :loading="loading" @submit="submit" />
    <div style="text-align: center" v-if="isEdit">
      <el-button type="primary" :loading="loading" @click="$refs.form.submit()">保存</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import { getOrg, updateOrg } from '@/api/system/depart'
export default {
  name: 'DepartInfo',
  props: ['departId', 'isEdit', 'users'],
  data() {
    return {
      loading: false,
      form: {},
      items: [
        {
          disabled: true,
          label: '职能类型',
          prop: 'type',
          type: 'select',
          options: [
            { label: '职能部门', value: 'functional' },
            { label: '教学部门', value: 'teaching' }
          ]
        },
        { prop: 'name', label: '部门名称', type: 'input', required: true },
        { prop: 'code', label: '部门编码', type: 'input', disabled: true },
        { prop: 'responsibleUser', label: '负责人', type: 'select', options: [] },
        { prop: 'contactUser', label: '联系人', type: 'select', options: [] },
        { prop: 'orderNo', label: '排序', type: 'number' },
        { prop: 'status', label: '状态', type: 'switch', number: true }
      ]
    }
  },
  watch: {
    departId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getOrgById(newVal)
          this.items[3].options = this.users.filter(user => user.orgId == newVal)
          this.items[4].options = this.users.filter(user => user.orgId == newVal)
        }
      }
    },
    isEdit: {
      immediate: true,
      handler(newVal) {
        this.items[1].disabled = !newVal
        this.items[3].disabled = !newVal
        this.items[4].disabled = !newVal
        this.items[5].disabled = !newVal
        this.items[6].disabled = !newVal
      }
    }
  },

  methods: {
    getOrgById(id) {
      this.loading = true
      getOrg(id)
        .then(res => {
          if (res.state) {
            this.form = res.value
          }
        })
        .finally(() => (this.loading = false))
    },

    submit(flag) {
      if (flag) {
        if (this.form.status == 0) {
          if (this.items[3].options.length > 0) {
            this.$message.error('组织下仍有用户，无法禁用！')
            this.getOrgById(this.departId)
            return
          }
        }
        updateOrg(this.form).then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh', this.form)
          } else {
            this.$message.error(res.message)
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.form {
  padding: 24px 32px;
}
</style>
