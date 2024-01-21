<template>
  <div class="repository-detail-layout">
    <div class="title-operator-button">
      <a-button @click="$router.back(-1)"><dc-icon type="icon-dc_back" />返回</a-button>
    </div>
    <div class="title-name">{{ title }}</div>
    <a-card style="width: 100%" :tab-list="detailTitle" :active-tab-key="titleKey" @tabChange="key => onTabChange(key)">
      <template v-if="titleKey === '1'">
        <FieldProps :formName="title"></FieldProps>
      </template>
      <template v-else>
        <DataDetails :formName="title"></DataDetails>
      </template>
      <a-button slot="tabBarExtraContent" type="primary" @click="view" id="form-view"><dc-icon class="icon-preview" type="icon-dc_form_table" /> 预览表单</a-button>
    </a-card>
  </div>
</template>
<script>
import DataDetails from './components/dataDetails.vue'
import FieldProps from './components/fieldProps.vue'
export default {
  name: 'RepositoryDetail',
  components: { DataDetails, FieldProps },
  data() {
    return {
      title: '',
      detailTitle: [
        {
          key: '0',
          tab: '数据详情'
        },
        {
          key: '1',
          tab: '字段属性'
        }
      ],
      titleKey: '0',
      formId: ''
    }
  },
  mounted() {
    const { title, formid, tab } = this.$route.query
    this.title = title || ''
    this.formId = formid || ''
    this.titleKey = tab || '0'
  },
  methods: {
    onTabChange(key) {
      this.titleKey = key
    },
    view() {
      console.log('预览表单')
    }
  }
}
</script>
<style scoped lang="less">
.repository-detail-layout {
  position: relative;
  .icon-preview{
    font-size: 14px !important;
  }
  .title-operator-button {
    position: absolute;
    right: 0;
    top: -5px;
    transform: translateY(-100%);
  }
  .title-name {
    font-size: 18px;
    font-weight: bold;
    color: #000000;
    line-height: 20px;
    margin-bottom: 16px;
  }
  /deep/.ant-card {
    .ant-card-head {
      padding: 0 20px 0 40px;
    }
    .ant-tabs .ant-tabs-large-bar .ant-tabs-tab {
      padding-left: 0;
      padding-right: 0;
      margin-right: 80px;
    }
    .ant-tabs-ink-bar {
      height: 6px;
    }
    .ant-card-body {
      padding: 20px;
    }
  }
}
</style>
