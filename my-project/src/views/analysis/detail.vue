<template>
  <div>
    <a-card class="header-card" :bordered="false" style="border-radius: 0">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="30">
            <a-col :xl="4" :lg="4" :md="6">
              <a-form-item label="年份">
                <a-select v-model="queryParam.year" placeholder="请选择年份" @change="searchData">
                  <a-select-option v-for="item in yearList" :key="item" :value="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="9">
              <a-form-item label="报告">
                <a-select v-model="qeuryType" placeholder="请选择报告" @change="searchData">
                  <a-select-option v-for="(item, index) in reportList" :key="index" :value="index">{{ item.title }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="7" :md="9">
              <a-form-item label="专业" v-if="queryParam.subjectId">
                <a-select v-model="queryParam.subjectId" placeholder="请选择专业" @change="searchData">
                  <a-select-option v-for="item in subjectList" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="24" :md="24" style="text-align: right">
              <a-button type="primary" @click="handleExport" :loading="exportLoading"><dc-icon type="icon-dc_export" />导出报告</a-button>
              <a-button @click="$router.back(-1)"><dc-icon type="icon-dc_back" />返回</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-spin :spinning="spinning">
      <a-row :gutter="20">
        <a-col :lg="6" :md="10">
          <a-card class="category-card" title="目录">
            <a-tree v-if="category.length" :tree-data="category" defaultExpandAll blockNode showIcon :selectedKeys="selectedKeys" @select="selectCategory">
              <img slot="titleicon" src="@/assets/icons/chapter.svg" alt="" />
            </a-tree>
          </a-card>
        </a-col>
        <a-col :gutter="20" :lg="18" :md="14">
          <a-card class="document-card" ref="documentCard" @scroll="handleDocumentScroll">
            <component :is="reportComponent" :details="detailsData" @showDetail="showDetail"></component>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
    <ReportDetails ref="detailDrawer" />
  </div>
</template>

<script>
import { reportList } from './report.js'
import ReportDetails from './components/ReportDetails.vue'
import UndergraduateStatus from './components/reports/UndergraduateStatus.vue'
import TeacherEducationStatus from './components/reports/TeacherEducationStatus.vue'
import UndergraduateQuality from './components/reports/UndergraduateQuality.vue'
import api from '@/api/analysis'
import repositoryApi from '@/api/repository'
const reportComponents = ['UndergraduateStatus', 'TeacherEducationStatus', 'UndergraduateQuality']

export default {
  name: 'MonitorDetail',
  components: { ReportDetails, UndergraduateStatus, TeacherEducationStatus, UndergraduateQuality },
  data() {
    return {
      category: [],
      qeuryType: '',
      queryParam: {
        year: '',
        type: '',
        subjectId: ''
      },
      reportList,
      yearList: [],
      subjectList: [],
      selectedKeys: [],
      exportLoading: false,
      reportComponent: '',
      detailsData: {},
      spinning: false
    }
  },
  watch: {
    qeuryType(newVal) {
      // 更新报告组件
      this.reportComponent = reportComponents[newVal] || reportComponents[0]
      this.queryParam.type = this.reportList[newVal]?.title
      this.queryParam.subjectId = newVal === 1 ? this.subjectList[0]?.id : ''
      this.$nextTick(() => {
        this.getCategory()
      })
    }
  },
  async created() {
    await this.getYears()
    await this.getSubjects()
    this.qeuryType = this.$route.query.type * 1 || 0
    this.getReportData()
  },
  methods: {
    // 获取报告年份
    getYears() {
      return repositoryApi.getYearList().then(res => {
        this.yearList = res.value
        this.queryParam.year = this.yearList[0]
      })
    },
    // 获取专业
    getSubjects() {
      return api.getSubjects().then(res => {
        this.subjectList = res.value
      })
    },
    searchData() {
      this.$nextTick(() => {
        this.getReportData()
      })
    },
    // 生成目录
    getCategory() {
      const createHeadingTree = (element, hIndex) => {
        if (hIndex > 6) return []
        const headings = [...element.querySelectorAll(`h${hIndex}`)]
        const nextIndex = hIndex + 1
        return headings.map((heading, index) => {
          const headId = hIndex === 1 ? `head_${index}` : `${heading.parentNode.parentNode.id}_${index}`
          heading.parentNode.id = headId
          heading.parentNode.classList.add('section')
          return {
            key: headId,
            title: heading.textContent,
            slots: hIndex === 1 ? { icon: 'titleicon' } : {},
            children: createHeadingTree(heading.parentNode, nextIndex) // 递归子标题
          }
        })
      }

      this.category = createHeadingTree(this.$refs.documentCard.$el, 1)
    },
    // 获取报告数据
    getReportData() {
      this.spinning = true
      api
        .getReport(this.queryParam)
        .then(res => {
          if (res.state) {
            // null值处理
            const newData = {}
            for (const key in res.value) {
              if (Object.hasOwnProperty.call(res.value, key)) {
                newData[key] = res.value[key] === null ? '' : res.value[key]
              }
            }
            this.detailsData = newData
          }
        })
        .finally(() => {
          this.spinning = false
        })
    },
    // 点击目录节点，文档滚动到指定位置
    selectCategory(keys) {
      const targetElement = document.getElementById(keys[0])
      // 滚动到对应位置
      this.$refs.documentCard.$el.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth'
      })
    },
    // 报告滚动目录标题高亮
    handleDocumentScroll(e) {
      const cardTop = this.$refs.documentCard.$el.getBoundingClientRect().top
      const headContents = document.querySelectorAll('.section')
      headContents.forEach(item => {
        if (item.getBoundingClientRect().top - cardTop <= 1) {
          this.selectedKeys = [item.id]
        }
      })
    },
    // 数据下钻
    showDetail(title) {
      this.$refs.detailDrawer.show(title)
    },
    handleExport() {
      if (!(this.queryParam.type && this.queryParam.year)) {
        this.$message.warning('请稍后再试')
        return
      }
      this.exportLoading = true
      api
        .exportReport(this.queryParam)
        .then(data => {
          if (!data) {
            this.$message.warning('报告下载失败！')
            this.exportLoading = false
            return
          }
          const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' }))
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', `${this.queryParam.type}_${this.queryParam.year}.doc`)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        })
        .catch(() => {
          this.$message.warning('报告下载失败！')
        })
        .finally(() => {
          this.exportLoading = false
        })
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
    font-size: 14px;
    line-height: 26px;
    color: #4a4c51;
    em {
      text-decoration: underline;
      font-style: normal;
    }
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #000;
      font-size: 15px;
      line-height: 22px;
      margin: 20px 0;
      margin-top: 40px;
    }
    h1 {
      font-size: 18px;
      + div {
        h2:first-of-type {
          margin-top: 0;
        }
      }
    }
    h2 {
      font-size: 16px;
      + div {
        h3:first-of-type {
          margin-top: 0;
        }
      }
    }
    .mt0 {
      margin-top: 0;
    }
    sup {
      font-size: 0.5em;
      vertical-align: super;
    }
    p {
      text-indent: 2em;
      margin: 10px 0;
      min-height: 10px;
    }
    p.tips {
      text-indent: 0;
      color: #666;
    }
    table {
      width: 100%;
      p {
        text-indent: 0;
      }
      th {
        background: #f4f5f6;
      }
      td,
      th {
        border: 1px solid #e8e8e8;
        text-align: center;
      }
    }
    .knowmore {
      color: #2f68bd;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}
.category-card,
.document-card {
  height: calc(100vh - 180px);
  overflow-y: auto;
}
</style>
