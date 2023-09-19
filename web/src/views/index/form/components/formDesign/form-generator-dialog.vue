<template>
  <dc-dialog v-if="visible" :visible.sync="visible" fullscreen :show-close="false" :append-to-body="true" :submitButtons="false" @close="close">
    <div slot="title" class="card-title">
      <span
        ><el-tag type="warning" style="margin-right: 24px">{{ info.type }}</el-tag> {{ info.name }}（{{ info.collectTimeType }}）</span
      >
      <div style="display: inline-block; margin-left: 30%">
        <!-- <el-tabs stretch>
          <el-tab-pane label="表单设计" name="first"></el-tab-pane>
          <el-tab-pane label="校验规则" name="second"></el-tab-pane>
        </el-tabs> -->
        <el-button type="text" @click="() => (this.activeTab = 0)" :class="{ active: activeTab == 0, inactive: activeTab == 1 }">表单设计</el-button>
        <el-button type="text" @click="() => (this.activeTab = 1)" :class="{ active: activeTab == 1, inactive: activeTab == 0 }">校验规则</el-button>
      </div>
      <div class="card-title-button">
        <el-button type="danger" @click="empty">清空</el-button>
        <el-button type="primary" @click="view">预览</el-button>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button n @click="visible = false"><svg-icon icon-class="返回" />返回</el-button>
      </div>
    </div>

    <div v-show="activeTab === 0">
      <form-generator :formInfo="info" :drawingList="drawingList" :form-config="formConfig" ref="formGenerator" @view="showView" @save="saveForm" />
    </div>
    <div class="container" v-if="activeTab === 1">
      <rule-detail :drawingList="drawingList" :formId="info.id" />
    </div>
    <form-view-drawer ref="formViewDrawer" />
  </dc-dialog>
</template>

<script>
import FormViewDrawer from './form-view-drawer.vue'
import RuleDetail from './rules/rule-detail'
import { updateForm } from '@/api/form'
export default {
  name: 'FormGeneartorDialog',
  components: { FormViewDrawer, RuleDetail },
  props: ['categories'],
  data() {
    return {
      visible: false,
      info: {},
      activeTab: 0,
      drawerVisible: false,
      drawingList: [],
      formConfig: null
    }
  },
  methods: {
    show(formInfo) {
      this.info = { ...formInfo, listCategories: this.categories }
      let formConfig = JSON.parse(formInfo.formProperties)
      let drawingList = JSON.parse(formInfo.componentProperties)
      if (formConfig != null) {
        this.formConfig = formConfig
      }
      if (drawingList != null) {
        this.drawingList = drawingList
      } else {
        this.drawingList = []
      }
      this.visible = true
    },

    close() {
      this.info = {}
      this.activeTab = 0
      this.formConfig = null
      this.drawingList = []
    },

    view() {
      this.$refs.formGenerator.view()
    },

    showView(formData) {
      this.$refs.formViewDrawer.show(formData)
    },

    empty() {
      this.drawingList = []
    },

    save() {
      this.$refs.formGenerator.save()
    },

    saveForm(formData) {
      const { fields } = formData
      Reflect.deleteProperty(formData, 'fields')
      Reflect.deleteProperty(formData, 'formBtns')
      const params = {
        ...this.info,
        formProperties: JSON.stringify(formData),
        componentProperties: JSON.stringify(fields)
      }
      this.loading = true
      updateForm(params)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
            this.$emit('refresh')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  font-size: 18px;
  padding-bottom: 32px;
  border-bottom: 6px solid;
}
.inactive {
  font-size: 18px;
  color: #4a4c51;
}
/deep/ .el-dialog__body {
  padding: 8px;
}
/deep/ .el-dialog__header {
  height: 52px;
  border-bottom: 1px solid #e5e5e5;
  padding: 0;
}
/deep/ .el-tabs__nav-scroll {
  width: 50%;
  margin: 0 auto;
}
</style>
