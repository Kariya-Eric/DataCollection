<template>
  <a-drawer v-if="visible" :visible="visible" width="70%" :closable="false">
    <div class="title-operator" slot="title">
      <span>{{ formName }}</span>
      <div class="title-operator-button">
        <a-button @click="close"><dc-icon type="icon-dc_back" />返回</a-button>
      </div>
    </div>
    <a-spin :spinning="spinning"> </a-spin>
  </a-drawer>
</template>

<script>
export default {
  name: 'ReportDetails',
  data() {
    return {
      formName: '',
      visible: false,
      spinning: false,
    }
  },
  methods: {
    show(formName, record) {
      // this.rowInfo = { ...record }
      this.formName = formName
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
