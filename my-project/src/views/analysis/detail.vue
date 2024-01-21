<template>
  <div>
    <a-card class="header-card" :bordered="false" style="border-radius: 0">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="30">
            <a-col :xl="4" :lg="4" :md="6">
              <a-form-item label="年份">
                <a-select v-model="queryParam.year" placeholder="请选择年份">
                  <a-select-option value="2023">2023</a-select-option>
                  <a-select-option value="2022">2022</a-select-option>
                  <a-select-option value="2021">2021</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="9">
              <a-form-item label="报告">
                <a-select v-model="queryParam.type" placeholder="请选择报告">
                  <a-select-option value="本科教学状态数据分析报告">本科教学状态数据分析报告</a-select-option>
                  <a-select-option value="本科教学质量报告">本科教学质量报告</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="9">
              <a-form-item label="专业">
                <a-select v-model="queryParam.type" placeholder="请选择专业">
                  <a-select-option value="本科教学状态数据分析报告">本科教学状态数据分析报告</a-select-option>
                  <a-select-option value="本科教学质量报告">本科教学质量报告</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="24" style="text-align: right">
              <a-button type="primary" @click="handleExport('用户导出')"><dc-icon type="icon-dc_import" />导出报告</a-button>
              <a-button @click="$router.back(-1)"><dc-icon type="icon-dc_back" />返回</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-row :gutter="20">
      <a-col :lg="6" :md="10">
        <a-card class="category-card" title="目录">
          <a-tree :tree-data="category" defaultExpandAll blockNode showIcon :selectedKeys.sync="selectedKeys" @select="selectCategory">
            <dc-icon slot="titleicon" type="icon-dc_home_page"></dc-icon>
          </a-tree>
        </a-card>
      </a-col>
      <a-col :gutter="20" :lg="18" :md="14">
        <a-card class="document-card" ref="documentCard" @scroll="handleDocumentScroll">
          <DocumentTree :documents="category" :level="1"></DocumentTree>
        </a-card>
      </a-col>
    </a-row>
    <ReportDetails ref="detailDrawer" />
  </div>
</template>

<script>
import { category } from './category'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import DocumentTree from './components/DocumentTree.vue'
import ReportDetails from './components/ReportDetails.vue'
export default {
  name: 'MonitorDetail',
  mixins: [DataCollectionListMixin],
  components: { DocumentTree, ReportDetails },
  data() {
    return {
      category,
      selectedKeys: []
    }
  },
  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == 'reportDetail') {
          this.queryParam.type = newRoute.query.type
          this.queryParam.year = '2023'
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 点击目录节点，文档滚动到指定位置
    selectCategory(keys) {
      const targetElement = document.getElementById('section-' + keys[0])
      // 滚动到对应位置
      this.$refs.documentCard.$el.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      })
      this.selectedKeys = keys
    },
    handleDocumentScroll(e) {
      console.log('滚动', e)
      this.selectedKeys = ['1']
    }
  }
}
</script>

<style lang="less" scoped>
.header-card {
  margin: -24px;
  margin-bottom: 20px;
  /deep/.ant-card-body {
    padding: 20px 20px 0 20px;
  }
  .table-page-search-wrapper {
    /deep/.ant-form-item-label {
      padding-right: 10px;
      label::after {
        display: none;
      }
    }
    .ant-form-inline .ant-form-item {
      margin-bottom: 20px;
    }
    button {
      margin-left: 20px;
      margin-bottom: 20px;
    }
  }
}
.category-card {
  /deep/.ant-card-head {
    padding: 0 16px;
    .ant-card-head-title {
      font-size: 16px !important;
      padding: 14px 0;
    }
  }
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
  /deep/.ant-card-body {
    overflow-y: auto;
    height: calc(100% - 52px);
    padding: 10px;
  }
}
.document-card {
  /deep/.ant-card-body {
    padding: 20px;
  }
}
.category-card,
.document-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>
