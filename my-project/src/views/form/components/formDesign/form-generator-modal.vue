<template>
  <dc-modal :visible="visible" :confirmLoading="loading" @ok="handleOk">
    <template slot="title">
      <a-row type="flex" class="title-row" justify="space-between">
        <a-col class="left">
          <a-tag color="orange">{{ info.type }}</a-tag>
          <span>{{ info.name }}（{{ info.collectTimeType }}）</span>
        </a-col>
        <a-col class="center">
          <a-tabs v-model="activeTab">
            <a-tab-pane :key="0">
              <span slot="tab" style="font-size: 20px"> 表单设计 </span>
            </a-tab-pane>
            <a-tab-pane :key="1">
              <span slot="tab" style="font-size: 20px"> 校验规则 </span>
            </a-tab-pane>
          </a-tabs>
        </a-col>
        <a-col class="right">
          <a-button type="danger"> 清空</a-button>
          <a-button type="primary" @click="view">预览</a-button>
          <a-button type="primary">保存</a-button>
          <a-button @click="handleCancel">返回</a-button>
        </a-col>
      </a-row>
    </template>

    <div v-show="activeTab === 0">
      <form-generator :formInfo="info" :drawingList="drawingList" :form-config="formConfig" ref="formGenerator" @view="showView" @save="saveForm" />
    </div>

    <div class="container" v-if="activeTab === 1">123</div>
    <form-view-drawer ref="formViewDrawer" />
  </dc-modal>
</template>

<script>
import FormViewDrawer from './form-view-drawer.vue'
export default {
  name: 'FormGeneratorModal',
  props: ['categories'],
  components: { FormViewDrawer },
  data() {
    return {
      info: {},
      visible: false,
      loading: false,
      drawingList: [],
      formConfig: null,
      activeTab: 0
    }
  },
  methods: {
    handleOk() {},
    handleCancel() {
      this.info = {}
      this.formConfig = null
      this.drawingList = []
      this.visible = false
    },

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

    view() {
      this.$refs.formGenerator.view()
    },

    save() {
      this.$refs.formGenerator.save()
    },

    showView(formData) {
      this.$refs.formViewDrawer.show(formData)
    },

    saveForm(formData) {}
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal {
  width: 100vw !important;
  max-width: 100vw !important;
  top: 0 !important;
  padding: 0 !important;
}
/deep/.ant-modal-body {
  height: calc(100vh - 55px) !important;
  max-height: calc(100vh - 55px) !important;
  padding-top: 8px !important;
  overflow: auto;
}
/deep/.ant-modal-header {
  border-radius: 0 !important;
}
/deep/.ant-modal-title {
  font-size: 20px !important;
  font-weight: 600 !important;
  line-height: 26px !important;
}
/deep/.ant-modal-content {
  height: 100vh !important;
  border-radius: 0 !important;
}
.title-row {
  .left {
    width: 25%;
  }
  .center {
    position: absolute;
    left: 40%;
    top: 12px;
  }
  .right {
    .ant-btn {
      margin-left: 12px;
    }
  }
}
</style>
