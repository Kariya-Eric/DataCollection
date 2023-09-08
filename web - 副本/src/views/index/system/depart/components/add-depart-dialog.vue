<template>
  <dc-dialog :visible.sync="visible" title="添加组织" :disabled="loading" width="30%" @confirm="$refs.form.submit()">
    <dc-form ref="form" :form="form" :loading="loading" :items="formItems" @submit="submit" />
  </dc-dialog>
</template>

<script>
import { addOrg } from '@/api/system/depart'
export default {
  name: 'AddDepartDialog',
  props: ['functionId', 'teachingId'],
  data() {
    return {
      visible: false,
      loading: false,
      form: {},
      formItems: [
        {
          label: '职能类型',
          type: 'select',
          prop: 'type',
          required: true,
          options: [
            { label: '职能部门', value: 'functional' },
            { label: '教学部门', value: 'teaching' }
          ]
        },
        { type: 'input', prop: 'name', label: '部门名称', required: true },
        { type: 'input', prop: 'code', label: '部门编码', required: true },
        { type: 'number', prop: 'orderNo', label: '排序', required: true },
        { type: 'switch', prop: 'status', label: '状态', number: true }
      ]
    }
  },
  watch: {
    'form.type'(newVal) {
      if (newVal == 'functional') {
        this.form.parentId = this.functionId
      } else if (newVal == 'teaching') {
        this.form.parentId = this.teachingId
      }
    }
  },
  methods: {
    add() {
      this.form = Object.assign({}, { status: 1 })
      this.$nextTick(() => this.$refs.form.reset())
      this.visible = true
    },

    submit(flag) {
      if (flag) {
        this.loading = true
        addOrg(this.form)
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
}
</script>

<style></style>
