<template>
  <a-modal title="配置权限" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item prop="name" label="表单名称">
          <a-input v-model="model.name" disabled v-if="!isBatch" />
          <a-select v-model="model.formIds" disabled v-else mode="multiple">
            <a-select-option v-for="item in forms" :key="item.formId" :value="item.formId">{{ item.formName }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="responsibleOrgId" label="负责部门">
          <a-select v-model="model.responsibleOrgId" palceholder="请选择负责部门" allowClear>
            <a-select-opt-group v-for="group in departs" :key="group.id">
              <span slot="label">{{ group.name }}</span>
              <a-select-option v-for="item in group.children.filter(i => i.status == 1)" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-model-item>
        <a-form-model-item prop="collaborateOrgId" label="协作部门" :hidden="showCollaborateOrg">
          <a-select v-model="model.collaborateOrgId" palceholder="请选择协作部门" allowClear mode="multiple" @change="changeCollaborateOrgId">
            <a-select-opt-group v-for="group in departs" :key="group.id">
              <span slot="label" class="checkItem">
                <a-checkbox v-model="checked" :indeterminate="indeterminate" @change="selectAll" v-if="group.name === '教学部门'"> </a-checkbox>
                {{ group.name }}
              </span>
              <a-select-option v-for="item in group.children.filter(i => i.status == 1)" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { configAuthority } from '@/api/task'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'PermissionDialog',
  props: ['taskId', 'departs', 'forms'],
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {
        responsibleOrgId: [{ required: 'true', message: '请选择负责部门', trigger: 'change' }],
        collaborateOrgId: [
          {
            validator: (rule, value, callback) => {
              if (value && value.length > 0) {
                let fixedForm = []
                this.model.formIds.forEach(id => {
                  let form = this.forms.find(item => item.formId === id)
                  if (form.formType === '固定表单') {
                    fixedForm.push(form.formName)
                  }
                })
                if (!this.showCollaborateOrg && fixedForm.length > 0) {
                  callback(new Error(`【${fixedForm.join('，')}】为固定表单，无法配置协作部门`))
                }
                let index = value.indexOf(this.model.responsibleOrgId)
                if (index != -1) {
                  callback(new Error('负责部门和协作部门不能相同！'))
                }
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      checked: false,
      indeterminate: false,
      showCollaborateOrg: false,
      isBatch: false
    }
  },

  methods: {
    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },

    edit(records) {
      if (Array.isArray(records)) {
        this.isBatch = true
        this.model.formIds = records
        this.showCollaborateOrg = false
        this.model = Object.assign({}, this.model, { collaborateOrgId: [], responsibleOrgId: '' })
      } else {
        this.showCollaborateOrg = records.formType == '固定表单'
        this.model = { ...records, name: records.formName, formIds: [records.formId], collaborateOrgId: records.collaborateOrgId ? records.collaborateOrgId.split(',') : [] }
        this.isBatch = false
      }
      this.changeCollaborateOrgId()
      this.visible = true
    },

    selectAll() {
      this.indeterminate = false
      let teachingDept = this.departs.find(dept => dept.name === '教学部门')
      this.model.collaborateOrgId = this.checked ? teachingDept.children.filter(i => i.status == 1).map(item => item.id) : []
    },

    changeCollaborateOrgId() {
      let teachingDeptIds = this.departs
        .find(dept => dept.name === '教学部门')
        .children.filter(i => i.status == 1)
        .map(item => item.id)
      let count = 0
      for (let i = 0; i < teachingDeptIds.length; i++) {
        if (this.model.collaborateOrgId.indexOf(teachingDeptIds[i]) > -1) {
          count++
        }
      }
      this.checked = count == teachingDeptIds.length
      this.indeterminate = count > 0 && count < teachingDeptIds.length
      this.$forceUpdate()
    },

    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let collaborateOrgId = this.model.collaborateOrgId ? this.model.collaborateOrgId.join(',') : ''
          let depts = [...this.departs[0].children, ...this.departs[1].children]
          let collaborateOrgName = this.model.collaborateOrgId
            .map(id => {
              let dept = depts.find(item => item.id == id)
              if (dept) {
                return dept.name
              }
              return ''
            })
            .join(',')
          let responsibleOrgName = depts.find(item => item.id == this.model.responsibleOrgId).name
          let params = { ...this.model, collaborateOrgId, collaborateOrgName, responsibleOrgName, taskId: this.taskId }
          configAuthority(params)
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.close()
                this.$emit('refresh', params)
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => (this.loading = false))
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.checkItem {
  margin-left: 8px;
}
</style>
