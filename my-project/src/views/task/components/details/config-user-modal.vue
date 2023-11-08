<template>
  <a-modal title="配置人员" :visible="visible" :confirmLoading="loading" @cancel="handleCancel" :maskClosable="false" :keyboard="false" width="30%" destroyOnClose :footer="null">
    <a-form-model ref="form" :model="model" v-bind="layout" :rules="rules">
      <a-form-model-item :hidden="true">
        <a-input v-model="model.responsibleUserName" />
      </a-form-model-item>
      <a-form-model-item :hidden="true">
        <a-input v-model="model.fillUserName" />
      </a-form-model-item>
      <a-form-model-item label="表单名称">
        <a-input disabled v-model="model.formName" />
      </a-form-model-item>
      <a-form-model-item label="填报人" prop="fillUser" v-if="!fillUserHidden">
        <a-select v-model="model.fillUser" placeholder="请选择填报人" showSearch allowClear>
          <a-select-option v-for="user in userList" :key="user.id" :value="user.id">{{ user.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="审核人" prop="responsibleUser">
        <a-select v-model="model.responsibleUser" placeholder="请选择审核人" showSearch allowClear>
          <a-select-option v-for="user in userList" :key="user.id" :value="user.id">{{ user.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
    <div style="text-align: center; margin-bottom: 16px">
      <a-button @click="handleCancel" style="margin-right: 10px">取消</a-button>
      <a-popconfirm title="人员配置完成后不可调整，是否确认?" :visible="popconfirmVisible" @confirm="handleOk" @cancel="popconfirmVisible = false" placement="bottom">
        <a-button type="primary" @click="popconfirmVisible = true">确定</a-button>
      </a-popconfirm>
    </div>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getUserList } from '@/api/system/user'
import { configAuthUser } from '@/api/task'
export default {
  name: 'ConfigUserModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      popconfirmVisible: false,
      userList: [],
      rules: {
        responsibleUser: [{ required: true, message: '请选择审核人', trigger: 'change' }],
        fillUser: [
          { required: true, message: '请选择填报人', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value) {
                if (!this.fillUserHidden && value == this.model.responsibleUser) {
                  callback(new Error('审核人和填报人不能相同'))
                }
                callback()
              }
              callback(new Error('请选择填报人'))
            },
            trigger: 'change'
          }
        ]
      },
      fillUserHidden: false
    }
  },
  watch: {
    'model.responsibleUser'(newVal) {
      if (newVal) {
        this.model.responsibleUserName = this.userList.find(item => item.id == newVal).name
      }
    },
    'model.fillUser'(newVal) {
      if (newVal) {
        this.model.fillUserName = this.userList.find(item => item.id == newVal).name
      }
    }
  },

  methods: {
    getUser(orgId) {
      this.loading = true
      getUserList({ params: { orgId } })
        .then(res => {
          if (res.state) {
            this.userList = res.value.rows
          }
        })
        .finally(() => (this.loading = false))
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
      this.model = {}
    },

    show(info) {
      this.fillUserHidden = info.type == '总表'
      this.getUser(info.orgId)
      this.model.id = info.id
      this.model.formName = info.formName
      this.model = Object.assign({}, this.model)
      this.visible = true
    },

    handleOk() {
      this.popconfirmVisible = false
      this.$refs.form.validate(valid => {
        if (valid) {
          configAuthUser(this.model).then(res => {
            if (res.state) {
              this.close()
              this.$message.success(res.message)
              this.$emit('refresh')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
