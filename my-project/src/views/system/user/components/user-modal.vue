<template>
  <a-modal :title="title" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="35%">
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model" :rules="rules">
        <a-form-model-item label="账号" prop="account">
          <a-input v-model="model.account" placeholder="请输入账号" :disabled="accountDisabled" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="model.name" placeholder="请输入姓名" :disabled="disabled" allowClear></a-input>
        </a-form-model-item>
        <a-form-model-item label="所属部门" prop="orgId" v-if="showDepart">
          <a-tree-select
            :getPopupContainer="target => target.parentNode"
            :disabled="disabled"
            v-model="model.orgId"
            show-search
            placeholder="请选择请选择部门"
            allow-clear
            tree-default-expand-all
            :tree-data="depart"
            :replace-fields="replaceFields"
            :filterTreeNode="filterTreeNode"
            :dropdown-style="{ maxHeight: '320px', overflow: 'auto' }"
          />
        </a-form-model-item>
        <a-form-model-item label="角色" prop="roleIds">
          <a-select v-model="model.roleIds" mode="multiple" placeholder="请选择角色" :disabled="disabled" allowClear>
            <a-select-option v-for="r in role" :key="r.id" :value="r.id">{{ r.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="专业" prop="subjectId">
          <a-select v-model="model.subjectId" m placeholder="请选择专业" :disabled="disabled" allowClear>
            <a-select-option v-for="r in subjects" :key="r.id" :value="r.id">{{ r.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="model.email" placeholder="请输入邮箱" :disabled="disabled" allowClear><a-icon slot="suffix" type="mail" /></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机" prop="mobile">
          <a-input v-model="model.mobile" placeholder="请输入手机" :disabled="disabled" allowClear> <a-icon slot="suffix" type="mobile" /></a-input>
        </a-form-model-item>
        <a-form-model-item label="状态" prop="status">
          <dc-switch v-model="model.status" />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getUserDetail, addUser, updateUser } from '@/api/system/user'
export default {
  name: 'UserModal',
  mixins: [DataCollectionModalMixin],
  props: ['depart', 'role', 'subjects'],
  data() {
    return {
      replaceFields: {
        title: 'name',
        key: 'id',
        value: 'id'
      },
      filterTreeNode: (inputValue, treeNode) => treeNode.data.props.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
      rules: {
        account: [{ required: true, message: '请输入账号' }],
        name: [{ required: true, message: '请输入姓名' }],
        orgId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }],
        email: [{ pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/, message: '请输入合法的邮箱' }],
        mobile: [{ pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入合法的手机' }]
      },
      showDepart: true,
      accountDisabled: true
    }
  },
  watch: {
    depart: {
      immediate: true,
      handler(newVal) {
        if (typeof newVal === 'string') {
          this.showDepart = false
        } else {
          this.showDepart = true
        }
      }
    }
  },
  methods: {
    add(title) {
      this.edit(this.showDepart ? { status: 1 } : { orgId: this.depart, status: 1 }, title)
      this.$nextTick(() => (this.accountDisabled = false))
    },

    edit(record, title) {
      this.title = title
      if (record.id) {
        this.loading = true
        getUserDetail(record.id)
          .then(res => {
            if (res.state) {
              this.model = Object.assign({}, res.value)
            } else {
              this.model = Object.assign({}, record)
            }
          })
          .finally(() => (this.loading = false))
      } else {
        this.model = Object.assign({}, record)
      }
      this.visible = true
    },

    close() {
      this.model = {}
      this.$refs.form.clearValidate()
      this.$emit('close')
      this.visible = false
      this.accountDisabled = true
    },

    handleOk() {
      const that = this
      this.$refs.form.validate(valid => {
        if (valid) {
          that.loading = true
          let handler
          if (!this.model.id) {
            handler = addUser({ ...this.model, password: '123456' })
          } else {
            handler = updateUser(this.model)
          }
          handler
            .then(res => {
              if (res.state) {
                that.$message.success(res.message)
                this.$emit('ok')
                that.close()
              } else {
                that.$message.error(res.message)
              }
            })
            .finally(() => (that.loading = false))
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="less"></style>
