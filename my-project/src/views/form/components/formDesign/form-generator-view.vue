<template>
  <div class="totalView">
    <div class="title">
      <a-row class="title-row">
        <a-col :span="8">
          <div class="left">
            <a-tag color="orange">{{ info.type }}</a-tag>
            <span>{{ info.name }}（{{ info.collectTimeType }}）</span>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="middle">
            <a-tabs v-model="activeTab">
              <a-tab-pane :key="0">
                <span slot="tab" style="font-size: 20px"> 表单设计 </span>
              </a-tab-pane>
              <a-tab-pane :key="1">
                <span slot="tab" style="font-size: 20px"> 校验规则 </span>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-col>
        <a-col :span="8">
          <div class="right">
            <a-popconfirm title="确认清空所有组件吗？" @confirm="empty" placement="bottom" v-if="info.enabledFlag != 1">
              <a-button type="danger" v-if="activeTab == 0"><dc-icon type="icon-dc_empty" />清空</a-button>
            </a-popconfirm>
            <a-button type="primary" @click="view" id="form-view"><dc-icon type="icon-dc_view" /> 预览</a-button>
            <a-button type="primary" @click="save" v-if="activeTab == 0 && info.enabledFlag != 1"><dc-icon type="icon-dc_save" /> 保存</a-button>
            <a-button @click="handleCancel" v-if="activeTab == 0"><dc-icon type="icon-dc_back" /> 返回</a-button>
          </div>
        </a-col>
      </a-row>
    </div>
    <div v-show="activeTab === 0">
      <form-generator
        :disabled="info.enabledFlag == 1"
        :formInfo="info"
        :drawingList="drawingList"
        :form-config="formConfig"
        ref="formGenerator"
        @view="showView"
        @save="saveForm"
        @empty="empty"
      />
    </div>

    <div class="container" v-if="activeTab === 1">
      <rule-detail :drawingList="drawingList" :formId="info.id" />
    </div>
    <form-view-drawer ref="formViewDrawer" />
  </div>
</template>

<script>
import FormViewDrawer from './form-view-drawer.vue'
import RuleDetail from './rule-detail.vue'
import { updateForm } from '@/api/form'
import { FORM_INFO, FORM_CATES } from '@/store/mutation-types'
import storage from 'store'
export default {
  name: 'FormGeneratorModal',
  components: { FormViewDrawer, RuleDetail },
  data() {
    return {
      info: {},
      drawingList: [],
      formConfig: null,
      activeTab: 0,
      formList: [],
      categories: storage.get(FORM_CATES),
      collectionDetail: {}
    }
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'formDesign') {
          this.collectionDetail = JSON.parse(newRoute.query.collectionInfo)
          let formInfo = storage.get(FORM_INFO)
          this.show(formInfo)
        }
      },
      immediate: true
    }
  },

  methods: {
    handleCancel() {
      this.info = {}
      this.formConfig = null
      this.drawingList = []
      storage.remove(FORM_INFO)
      this.$router.push({ path: '/form/detail', query: { collectionInfo: JSON.stringify(this.collectionDetail) } })
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
      this.activeTab = 0
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

    empty() {
      this.drawingList = []
    },

    saveForm(formData) {
      const { fields } = formData
      if (fields.length == 0) {
        this.$message.error('请至少给表单配置一个组件后再保存！')
        return
      }
      Reflect.deleteProperty(formData, 'fields')
      Reflect.deleteProperty(formData, 'formBtns')
      fields.forEach(field => {
        field.__config__.defaultValue = undefined
      })
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

<style lang="less" scoped>
.totalView {
  min-height: 620px;
  margin-top: -24px;
}
.title {
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  border-bottom: 1px solid #e8e8e8;
  padding: 0px 16px 0px 16px;
  color: black;
  background-color: white;
  margin-bottom: 12px;
}
.title-row {
  // /deep/.ant-tabs {
  //   margin-left: -96px;
  // }
  // /deep/.ant-tabs-bar {
  //   margin: 0 0 8px -12px;
  // }
  /deep/.ant-tabs-nav-wrap {
    text-align: center;
  }
  /deep/.ant-tabs-bar {
    border-bottom: none;
    margin-top: 4px;
  }
  .left {
    line-height: 64px;
  }
  .middle {
    margin: auto;
  }
  .right {
    line-height: 64px;
    float: right;
    .ant-btn {
      margin-left: 12px;
    }
  }
}
</style>
