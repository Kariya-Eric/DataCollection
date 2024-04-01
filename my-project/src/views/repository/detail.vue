<template>
  <div class="repository-detail-layout">
    <div class="title-operator-button">
      <a-button @click="$router.back(-1)"><dc-icon type="icon-dc_back" />返回</a-button>
    </div>
    <div class="title-name">
      {{ detailData?.name || '' }}<span v-if="detailData?.collectTimeType">（{{ detailData.collectTimeType }}）</span>
    </div>
    <a-card style="width: 100%" :tab-list="detailTitle" :active-tab-key="titleKey" @tabChange="key => onTabChange(key)">
      <template v-if="titleKey === '1'">
        <FieldProps></FieldProps>
      </template>
      <template v-else>
        <DataDetails></DataDetails>
      </template>
      <a-button slot="tabBarExtraContent" type="primary" @click="showView" id="form-view"><dc-icon class="icon-preview" type="icon-dc_form_table" /> 预览表单</a-button>
    </a-card>
    <form-view-drawer ref="formViewDrawer" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
import DataDetails from './components/dataDetails.vue'
import FieldProps from './components/fieldProps.vue'
import FormViewDrawer from '@/views/form/components/formDesign/form-view-drawer.vue'
export default {
  name: 'RepositoryDetail',
  components: { DataDetails, FieldProps, FormViewDrawer },
  data() {
    return {
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
      titleKey: '0'
    }
  },
  computed: {
    ...mapState({
      detailData: state => state.repository.repositorySelForm
    })
  },
  mounted() {
    if (this.detailData) {
      console.log('数据详情', this.detailData)
      const { tab } = this.$route.query
      this.titleKey = tab || '0'
    } else {
      this.$router.push({
        path: '/repository/list'
      })
    }
  },
  methods: {
    onTabChange(key) {
      this.titleKey = key
    },
    showView() {
      const fields = JSON.parse(this.detailData.componentProperties)
      if (!fields) {
        this.$message.warning('当前表单暂无数据')
        return
      }
      const formData = {
        ...JSON.parse(this.detailData.formProperties),
        fields
      }
      this.$refs.formViewDrawer.show(formData)
    }
  }
}
</script>
<style scoped lang="less">
.repository-detail-layout {
  position: relative;
  .icon-preview {
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
