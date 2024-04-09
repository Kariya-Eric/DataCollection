<template>
  <div>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layouts" :model="model" :rules="rules">
        <a-form-model-item label="职能类型">
          <a-select v-model="model.type" :disabled="true">
            <a-select-option value="functional">职能部门</a-select-option>
            <a-select-option value="teaching">教学部门</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="name">
          <a-input v-model="model.name" placeholder="请输入部门名称" allowClear :disabled="!isEdit || !authFlag" />
        </a-form-model-item>
        <a-form-model-item label="部门编码">
          <a-input v-model="model.code" :disabled="true" />
        </a-form-model-item>
        <a-form-model-item label="负责人" prop="responsibleUser">
          <a-select v-model="model.responsibleUser" placeholder="请选择负责人" allowClear :disabled="!isEdit">
            <a-select-option v-for="user in users.filter(user => user.orgId == orgId)" :key="user.id" :value="user.id">{{ user.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="联系人" prop="contactUser">
          <a-select v-model="model.contactUser" placeholder="请选择联系人" allowClear :disabled="!isEdit">
            <a-select-option v-for="user in users.filter(user => user.orgId == orgId)" :key="user.id" :value="user.id">{{ user.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="排序" prop="orderNo">
          <a-input-number v-model="model.orderNo" :min="0" :precision="0" placeholder="请输入排序" allowClear style="width: 15%" :disabled="!isEdit || !authFlag" />
        </a-form-model-item>
        <a-form-model-item label="状态">
          <dc-switch v-model="model.status" :disabled="!isEdit || !authFlag" @change="changeStatus" />
        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 10 }" v-if="isEdit">
          <a-button type="primary" @click="handleSubmit"> 保存 </a-button>
          <a-button style="margin-left: 10px" @click="resetForm"> 取消 </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </div>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getOrg, updateOrg } from '@/api/system/depart'
import { ROLE_LIST } from '@/store/mutation-types'
import storage from 'store'
export default {
  name: 'DepartInfo',
  props: ['isEdit', 'users', 'orgId'],
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      rules: {
        name: [{ required: true, message: '请输入部门名称' }],
        orderNo: [{ required: true, message: '请输入排序' }],
        responsibleUser: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value == this.model.contactUser) {
                  callback(new Error('联系人和负责人不能相同'))
                }
                callback()
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        contactUser: [
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (value == this.model.responsibleUser) {
                  callback(new Error('联系人和负责人不能相同'))
                }
                callback()
              }
              callback()
            },
            trigger: 'change'
          }
        ]
      },
      layouts: {
        labelCol: { style: 'width: 144px; display: inline-block; vertical-align: inherit;' },
        wrapperCol: { style: 'width: calc(100% - 168px); display: inline-block;' }
      },
      authFlag: storage.get(ROLE_LIST).indexOf('superAdmin') > -1 || storage.get(ROLE_LIST).indexOf('admin') > -1
    }
  },
  watch: {
    orgId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.getOrgById(newVal)
        }
      }
    }
  },
  methods: {
    getOrgById(id) {
      this.loading = true
      getOrg(id)
        .then(res => {
          if (res.state) {
            this.model = {
              ...res.value,
              contactUser: res.value.contactUser ? res.value.contactUser : undefined,
              responsibleUser: res.value.responsibleUser ? res.value.responsibleUser : undefined
            }
          }
        })
        .finally(() => (this.loading = false))
    },

    resetForm() {
      this.$refs.form.clearValidate()
      this.getOrgById(this.orgId)
      this.$emit('reset')
    },

    changeStatus(val) {
      if (val === 0) {
        if (this.users.filter(user => user.orgId == this.orgId).length > 0) {
          this.$message.error('当前组织下仍有用户，无法禁用！')
          this.model.status = 1
        }
      }
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          updateOrg({
            ...this.model,
            contactUser: this.model.contactUser ? this.model.contactUser : '',
            responsibleUser: this.model.responsibleUser ? this.model.responsibleUser : ''
          })
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.$emit('reset')
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => (this.loading = false))
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
