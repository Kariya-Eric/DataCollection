<template>
  <div>
    <dc-dialog :visible.sync="visible" title="添加专业" :disabled="loading" width="30%" @confirm="$refs.form.submit()">
      <dc-form ref="form" :form="form" :loading="loading" :items="formItems" @submit="submit" label-width="120px" />
    </dc-dialog>
  </div>
</template>

<script>
import { addSubject } from '@/api/system/subject'
export default {
  name: 'AddSubjectDialog',
  props: ['departList'],
  data() {
    return {
      visible: false,
      loading: false,
      form: {},
      formItems: [
        { label: '所属院系', type: 'select', group: true, options: [], required: true, prop: 'orgId' },
        { label: '专业名称', type: 'input', prop: 'name', required: true },
        { label: '校内专业代码', type: 'input', prop: 'code', required: true },
        { label: '国标专业代码', type: 'input', prop: 'internationalCode', required: true },
        { prop: 'sort', label: '排序', type: 'number', required: true },
        { prop: 'status', label: '状态', type: 'switch', number: true }
      ]
    }
  },
  watch: {
    departList: {
      immediate: true,
      handler(newVal) {
        let options = []
        if (newVal.length > 0) {
          let teachingDepart = newVal[0].children.find(depart => depart.name == '教学部门')
          let teachingOptions = []
          if (teachingDepart) {
            teachingOptions = teachingDepart.children.map(item => {
              let { name, id, status } = item
              return { name, id, disabled: status == 0 }
            })
          }
          options.push({ label: '教学部门', options: teachingOptions })
          this.formItems[0].options = options
        }
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
        addSubject(this.form)
          .then(res => {
            if (res.state) {
              this.$message.success(res.message)
              this.visible = false
              this.$emit('refresh')
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

<style scoped lang="scss"></style>
