<template>
  <div class="form">
    <dc-form ref="form" :items="items" :form="form" :loading="loading" @submit="submit" label-width="120px" />
    <div style="text-align: center" v-if="isEdit">
      <el-button type="primary" :loading="loading" @click="$refs.form.submit()">保存</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
import { updateSubject } from '@/api/system/subject'
export default {
  name: 'SubjectInfo',
  props: ['subject', 'isEdit', 'users', 'orgs'],
  data() {
    return {
      loading: false,
      form: {},
      items: [
        { prop: 'orgId', label: '所属院系', type: 'select', disabled: true, options: [] },
        { prop: 'name', label: '专业名称', type: 'input', required: true },
        { prop: 'code', label: '校内专业代码', type: 'input', required: true },
        { prop: 'internationalCode', label: '国标专业代码', type: 'input', required: true },
        { prop: 'sort', label: '排序', type: 'number', required: true },
        { prop: 'status', label: '状态', type: 'switch', number: true }
      ]
    }
  },
  watch: {
    subject: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = Object.assign({}, newVal)
          this.$nextTick(() => this.$refs.form.reset())
        }
      }
    },
    orgs: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          this.items[0].options = newVal
        }
      }
    }
  },

  methods: {
    submit(flag) {
      if (flag) {
        updateSubject(this.form).then(res => {
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
