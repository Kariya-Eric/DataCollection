<template>
  <a-drawer v-if="visible" :visible="visible" :width="1200" :closable="false">
    <div class="title-operator" slot="title">
      <span>{{ formName }}</span>
      <div class="title-operator-button">
        <a-button type="primary" v-if="judgeImport(rowInfo, currentUser, roleList)">导入</a-button>
        <a-button type="primary" v-if="judgeExport(rowInfo, currentUser, roleList)">导出</a-button>
        <a-button type="primary" v-if="judgeYears(rowInfo, currentUser, roleList)">历年数据</a-button>
        <a-button type="primary" @click="$refs.formview.save()" v-if="judgeSave(rowInfo, currentUser, roleList)">保存</a-button>
        <a-button type="primary" @click="$refs.formview.submit()" v-if="judgeSave(rowInfo, currentUser, roleList)">提交</a-button>
        <a-popconfirm title="确认撤回该张表单吗？" @confirm="authForm(3)" v-if="judgeRedo(rowInfo, currentUser, roleList)">
          <a-button type="primary">撤回</a-button>
        </a-popconfirm>
        <a-popconfirm title="确认驳回该张表单吗？" @confirm="authForm(3)" v-if="judgeAuth(rowInfo, currentUser, roleList)">
          <a-button type="primary">驳回</a-button>
        </a-popconfirm>
        <a-button type="primary" @click="authForm(2)" v-if="judgeAuth(rowInfo, currentUser, roleList)">通过</a-button>

        <a-button @click="close">返回</a-button>
      </div>
    </div>

    <div :class="`showType_${type.class}`" v-if="type.title">
      <a-icon type="info-circle" />
      <span style="margin-left: 12px">{{ type.title }}</span>
    </div>

    <a-spin :spinning="loading">
      <form-view :formConf="formConf" ref="formview" @save="saveForm" @submit="submitForm" />
    </a-spin>
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
      showType: -1
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
      approveForm({ id: this.rowInfo.id, status })
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
            this.refreshData()
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
}
.showType_audit {
  background-color: #e6efff;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
  margin: -24px -24px 12px -24px;
}
.showType_redo {
  background-color: #fde0dd;
  height: 36px;
  line-height: 36px;
  padding-left: 24px;
  margin: -24px -24px 12px -24px;
}
</style>
