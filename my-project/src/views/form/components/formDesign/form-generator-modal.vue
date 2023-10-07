<template>
  <a-modal :visible="visible" :confirmLoading="loading" @ok="handleOk" :maskClosable="false" :keyboard="false" :footer="null" :closable="false">
    <template slot="title">
      <a-row type="flex" class="title-row">
        <a-col class="left">
          <a-tag color="orange">{{ info.type }}</a-tag>
          <span>{{ info.name }}（{{ info.collectTimeType }}）</span>
        </a-col>
        <a-col class="center"> </a-col>
        <a-col class="right">
          <div class="title-button">
            <a-button type="danger">清空</a-button>
            <a-button type="primary">预览</a-button>
            <a-button type="primary">保存</a-button>
            <a-button @click="handleCancel">返回</a-button>
          </div>
        </a-col>
      </a-row>
    </template>

    <form-generator :formInfo="info" :drawingList="drawingList" :form-config="formConfig" ref="formGenerator" />
  </a-modal>
</template>

<script>
export default {
  name: 'FormGeneratorModal',
  data() {
    return {
      info: {},
      visible: false,
      loading: false,
      drawingList: [],
      formConfig: null
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
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-modal {
  width: 100vw !important;
  max-width: 100vw !important;
  top: 0;
  padding: 0;
}

/deep/.ant-modal-body {
  height: calc(100vh - 55px) !important;
  max-height: calc(100vh - 55px) !important;
  overflow: auto;
}
/deep/.ant-modal-header {
  border-radius: 0 !important;
}
/deep/.ant-modal-content {
  height: 100vh !important;
  border-radius: 0 !important;
}
.title-row {
  .left {
    width: 30%;
  }
  .right {
    .title-button {
      right: 0px;
      .ant-btn {
        margin-left: 12px;
      }
    }
  }
}
</style>
