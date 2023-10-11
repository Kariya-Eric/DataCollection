<template>
  <a-drawer v-if="visible" :visible="visible" :width="1200" :closable="false">
    <div class="title-operator" slot="title">
      <span>{{ formName }}</span>
      <div class="title-operator-button">
        <a-button type="primary">导入</a-button>
        <a-button type="primary">带出</a-button>
        <a-button type="primary">历年数据</a-button>
        <a-button type="primary">提交</a-button>
        <a-button type="primary">撤回</a-button>
        <a-button type="primary">驳回</a-button>
        <a-button type="primary">通过</a-button>
        <a-button @click="close">返回</a-button>
      </div>
    </div>
    <form-view :formConf="formConf" ref="formview" />
  </a-drawer>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
export default {
  name: 'FormDrawer',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      formConf: {},
      formName: '',
      formId: ''
    }
  },
  methods: {
    show(formConf, formName, formId) {
      this.formName = formName
      this.formConf = JSON.parse(JSON.stringify(formConf))
      this.formId = formId
      this.visible = true
    },

    close() {
      this.visible = false
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
