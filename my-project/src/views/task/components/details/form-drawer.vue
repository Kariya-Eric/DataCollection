<template>
  <a-drawer v-if="visible" :visible="visible" :width="1200" :closable="false">
    <div class="title-operator" slot="title">
      <span>{{ formName }}</span>
      <div class="title-operator-button">
        <a-button type="primary" v-if="judgeImport(rowInfo, currentUser, roleList)"><dc-icon type="icon-dc_import" />导入</a-button>
        <a-button type="primary" v-if="judgeExport(rowInfo, currentUser, roleList)"><dc-icon type="icon-dc_export" />导出</a-button>
        <a-button type="primary" v-if="judgeYears(rowInfo, currentUser, roleList)"><dc-icon type="icon-dc_export" />历年数据</a-button>
        <a-button type="primary" @click="$refs.formview.save()" v-if="judgeSave(rowInfo, currentUser, roleList)"><dc-icon type="icon-dc_save" />保存</a-button>
        <a-button type="primary" @click="$refs.formview.submit()" v-if="judgeSave(rowInfo, currentUser, roleList)"><dc-icon type="icon-dc_submit" />提交</a-button>
        <a-popconfirm title="确认撤回该张表单吗？" @confirm="redoForm" v-if="judgeRedo(rowInfo, currentUser, roleList)">
          <a-button type="primary"><dc-icon type="icon-dc_back" />撤回</a-button>
        </a-popconfirm>
        <a-popconfirm title="确认驳回该张表单吗？" @confirm="showReject('', true)" v-if="judgeAuth(rowInfo, currentUser, roleList)">
          <a-button type="danger"><dc-icon type="icon-dc_reject" />驳回</a-button>
        </a-popconfirm>
        <a-button class="success-btn" @click="authForm(2)" v-if="judgeAuth(rowInfo, currentUser, roleList)"><dc-icon type="icon-dc_pass" />通过</a-button>
        <a-button @click="close"><dc-icon type="icon-dc_back" />返回</a-button>
      </div>
    </div>

    <div :class="`showType_${type.class}`" v-if="type.title">
      <dc-icon v-if="type.class === 'redo'" type="icon-dc_reject" style="color: #e23322; font-size: 18px" />
      <dc-icon v-if="type.class === 'audit'" type="icon-dc_waiting_audit" style="color: #2f68bd; font-size: 18px" />
      <dc-icon v-if="type.class === 'fill'" type="icon-dc_waiting_submit" style="color: #666666; font-size: 18px" />
      <span style="margin-left: 12px">{{ type.title }}</span>
      <a @click="showReject(rowInfo.rejectReason, false)" v-if="type.class === 'redo'" style="margin-left: 36px; font-size: 12px; text-decoration: underline">查看驳回原因</a>
    </div>

    <a-spin :spinning="loading">
      <form-view :formConf="formConf" ref="formview" @save="saveForm" @submit="submitForm" />
    </a-spin>
    <a-modal title="驳回原因" :visible="rejectVisible" destroyOnClose @cancel="closeReject" :maskClosable="false" :keyboard="false" :confirmLoading="rejectLoading" :footer="null">
      <a-form-model ref="rejectForm" :model="rejectForm" :rules="rejectRules">
        <a-form-model-item prop="rejectReason">
          <a-textarea v-model="rejectForm.rejectReason" placeholder="请输入驳回原因" :rows="6" :disabled="!rejectAddFlag" />
        </a-form-model-item>
      </a-form-model>
      <template v-if="rejectAddFlag">
        <div style="text-align: center">
          <a-button @click="closeReject" style="margin-right: 10px">取消</a-button>
          <a-button type="primary" @click="handleReject">确定</a-button>
        </div>
      </template>
    </a-modal>
  </a-drawer>
</template>

<script>
import { judgeImport, judgeExport, judgeYears, judgeSave, judgeRedo, judgeAuth } from './authForm'
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { updateTaskFormDetail, approveForm, submitForm, recallForm } from '@/api/task'
import storage from 'store'
import { USER_INFO, ROLE_LIST } from '@/store/mutation-types'
export default {
  name: 'FormDrawer',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      judgeImport,
      judgeExport,
      judgeYears,
      judgeSave,
      judgeRedo,
      judgeAuth,
      formConf: {},
      formName: '',
      formId: '',
      rowInfo: {},
      currentUser: storage.get(USER_INFO),
      roleList: storage.get(ROLE_LIST),
      showType: -1,
      rejectVisible: false,
      rejectReson: '',
      rejectForm: {},
      rejectAddFlag: false,
      rejectLoading: false,
      rejectRules: {
        rejectReason: [{ required: true, message: '请输入驳回原因' }]
      }
    }
  },
  computed: {
    type() {
      if (this.showType == 0) {
        return { title: '待提交', class: 'fill' }
      } else if (this.showType == 1) {
        return { title: '审核中', class: 'audit' }
      } else if (this.showType == 3) {
        return { title: '退回修改', class: 'redo' }
      }
      return {}
    }
  },
  methods: {
    showReject(rejectReason, addFlag) {
      this.rejectForm = Object.assign({}, { rejectReason })
      this.rejectAddFlag = addFlag
      this.rejectVisible = true
    },
    closeReject() {
      this.rejectVisible = false
      this.$refs.rejectForm.clearValidate()
    },

    handleReject() {
      this.$refs.rejectForm.validate(valid => {
        if (valid) {
          this.rejectLoading = true
          approveForm({ id: this.rowInfo.id, status: 3, rejectReason: this.rejectForm.rejectReason })
            .then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.closeReject()
                this.close()
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => (this.loading = false))
        } else {
          return
        }
      })
    },

    show(formConf, formName, formId, showType, record) {
      this.rowInfo = { ...record, status: showType }
      this.formName = formName
      this.formConf = JSON.parse(JSON.stringify(formConf))
      this.formId = formId
      this.showType = showType
      this.visible = true
    },

    close() {
      this.$emit('refresh')
      this.visible = false
    },

    saveForm(value) {
      this.loading = true
      updateTaskFormDetail({
        id: this.formId,
        formData: JSON.stringify(value)
      })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    submitForm(value) {
      this.loading = true
      submitForm({
        id: this.formId,
        formData: JSON.stringify(value)
      })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.close()
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    authForm(status) {
      this.loading = true
      approveForm({ id: this.rowInfo.id, status, rejectReason: '' })
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.close()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    redoForm() {
      this.loading = true
      recallForm(this.rowInfo.id)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.close()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped lang="less">
.title-operator {
  > span {
    font-size: 18px;
    font-weight: 600;
    line-height: 32px;
  }
  .title-operator-button {
    float: right;
    button {
      margin-left: 6px;
      margin-right: 6px;
    }
  }
}
.showType_fill {
  background-color: #eeefef;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
  margin: -24px -24px 12px -24px;
  > span {
    color: #666666;
    font-weight: 600;
  }
}
.showType_audit {
  background-color: #e6efff;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
  margin: -24px -24px 12px -24px;
  > span {
    color: #2f68bd;
    font-weight: 600;
  }
}
.showType_redo {
  background-color: #fde0dd;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
  margin: -24px -24px 12px -24px;
  > span {
    color: #e23322;
    font-weight: 600;
  }
}
.success-btn {
  background-color: rgb(43, 158, 119);
  color: #fff;
  border-color: rgb(43, 158, 119);
}
</style>
