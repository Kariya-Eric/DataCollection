<template>
  <div>
    <a-drawer v-if="visible" :visible="visible" width="80%" :closable="false">
      <div class="title-operator" slot="title">
        <span>表单预览</span>
        <div class="title-operator-button">
          <a-button @click="$refs.formView.save()">表单数据</a-button>
          <a-button @click="close">返回</a-button>
        </div>
      </div>
      <form-view :formConf="formConf" ref="formView" @save="saveForm" />
    </a-drawer>
  </div>
</template>

<script>
export default {
  name: 'FormViewDrawer',
  data() {
    return {
      visible: false,
      formConf: {}
    }
  },

  methods: {
    show(formConf) {
      this.formConf = JSON.parse(JSON.stringify(formConf))
      this.visible = true
    },

    close() {
      this.visible = false
    },

    saveForm(data) {
      console.log(data)
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
</style>
