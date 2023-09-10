<template>
  <dc-dialog
    title="配置权限"
    :visible.sync="visible"
    width="35%"
    :disabled="loading"
    :append-to-body="true"
    @confirm="$refs.permissionForm.submit()"
    @close="$emit('close')"
  >
    <dc-form :form="permissionForm" ref="permissionForm" label-width="80px" :items="items" :loading="loading" @submit="handleSubmit" />
  </dc-dialog>
</template>

<script>
import { configAuthority } from '@/api/task'
export default {
  name: 'PermissionDialog',
  props: ['taskId', 'departs'],
  data() {
    return {
      isBatch: false,
      visible: false,
      permissionForm: {},
      loading: false,
      submitFlag: '',
      items: [{ prop: 'name', type: 'input', required: true, label: '表单名称', disabled: true }],
      collaborateOrgName: '',
      responsibleOrgName: ''
    }
  },

  watch: {
    'permissionForm.responsibleOrgId'(val) {
      let depts = [...this.departList[0].options, ...this.departList[1].options]
      let find = depts.find(item => item.id == val)
      if (find) this.responsibleOrgName = find.name
    },
    'permissionForm.collaborateOrgId': {
      deep: true,
      handler(val) {
        if (val) {
          let depts = [...this.departList[0].options, ...this.departList[1].options]
          let finds = val.map(item => {
            let find = depts.find(ele => ele.id == item)
            return find.name
          })
          this.collaborateOrgName = finds.join('，')
        } else {
          this.collaborateOrgName = ''
        }
      }
    }
  },

  computed: {
    departList() {
      let options = []
      if (this.departs.length > 0) {
        let functionalDepart = this.departs[0].children.find(depart => depart.name == '职能部门')
        let functionalOptions = []
        if (functionalDepart) {
          functionalOptions = functionalDepart.children
            .filter(item => item.status == 1)
            .map(item => {
              let { name, id } = item
              return { name, id }
            })
        }
        let teachingDepart = this.departs[0].children.find(depart => depart.name == '教学部门')
        let teachingOptions = []
        if (teachingDepart) {
          teachingOptions = teachingDepart.children
            .filter(item => item.status == 1)
            .map(item => {
              let { name, id } = item
              return { name, id }
            })
        }
        options.push({ label: '职能部门', options: functionalOptions })
        options.push({ label: '教学部门', options: teachingOptions })
      }
      return options
    }
  },

  methods: {
    close() {
      this.visible = false
      this.$emit('close')
      this.$nextTick(() => this.$refs.permissionForm.resetFields())
    },

    handleSubmit(flag) {
      if (this.submitFlag != '') {
        this.$message.error(`【${this.submitFlag}】为固定表单，无法配置协作部门`)
        return
      }
      if (flag) {
        let collaborateOrgId = ''
        if (this.permissionForm.collaborateOrg) {
          collaborateOrgId = this.permissionForm.collaborateOrg.map(item => item.id).join(',')
        }
        let permissionForm = {
          ...this.permissionForm,
          collaborateOrgId,
          collaborateOrgName: this.collaborateOrgName,
          responsibleOrgName: this.responsibleOrgName,
          taskId: this.taskId
        }
        configAuthority(permissionForm)
          .then(res => {
            if (res.state) {
              this.$emit('refresh', permissionForm)
              this.$message.success(res.message)
              this.visible = false
            } else {
              this.$message.error(res.message)
            }
          })
          .finally(() => (this.loading = false))
      }
    },

    edit(records) {
      this.permissionForm.responsibleOrgId = ''
      this.permissionForm.collaborateOrgId = []
      if (records.length > 1) {
        this.isBatch = true
        let forms = records
          .filter(records => records.formType == '固定表单')
          .map(item => item.formName)
          .join('，')
        this.submitFlag = forms
        this.items = this.getFormItems(true)
        this.permissionForm.name = records.map(item => item.formName)
        this.permissionForm.formIds = records.map(item => item.formId)
        this.permissionForm = Object.assign({}, this.permissionForm)
      } else {
        this.isBatch = false
        this.submitFlag = ''
        this.items = this.getFormItems(false, records[0].formType != '固定表单')
        this.permissionForm = { ...records[0], name: records[0].formName, formIds: [records[0].formId] }
      }
      this.$nextTick(() => this.$refs.permissionForm.reset())
      this.visible = true
    },

    getFormItems(multiple, type) {
      if (multiple) {
        return [
          { prop: 'name', type: 'select', required: true, label: '表单名称', multiple: true, disabled: true, options: [] },
          {
            prop: 'responsibleOrgId',
            type: 'select',
            required: true,
            label: '负责部门',
            group: true,
            options: this.departList,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback(new Error('请选择负责部门'))
                  }
                  callback()
                }
              }
            ]
          },
          {
            prop: 'collaborateOrgId',
            type: 'select',
            label: '协作部门',
            group: true,
            options: this.departList,
            multiple: true,
            check: true,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value && value.length > 0) {
                    let index = value.indexOf(this.permissionForm.responsibleOrgId)
                    if (index != -1) {
                      callback(new Error('负责部门和协作部门不能相同！'))
                    }
                  }
                  callback()
                }
              }
            ]
          }
        ]
      } else {
        let items = [
          { prop: 'name', type: 'input', required: true, label: '表单名称', disabled: true },
          {
            prop: 'responsibleOrgId',
            type: 'select',
            required: true,
            label: '负责部门',
            group: true,
            options: this.departList,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (!value) {
                    callback(new Error('请选择负责部门'))
                  }
                  callback()
                }
              }
            ]
          }
        ]
        if (type) {
          items.push({
            prop: 'collaborateOrgId',
            type: 'select',
            label: '协作部门',
            group: true,
            options: this.departList,
            multiple: true,
            check: true,
            rules: [
              {
                validator: (rule, value, callback) => {
                  if (value && value.length > 0) {
                    let index = value.indexOf(this.permissionForm.responsibleOrgId)
                    if (index != -1) {
                      callback(new Error('负责部门和协作部门不能相同！'))
                    }
                  }
                  callback()
                }
              }
            ]
          })
        }
        return items
      }
    }
  }
}
</script>

<style></style>
