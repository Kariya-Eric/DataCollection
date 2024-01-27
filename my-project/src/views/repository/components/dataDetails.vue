<template>
  <div>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="20">
          <a-col :md="4" :sm="8">
            <a-form-item>
              <a-select v-model="queryParam.year" placeholder="统计时间" allowClear>
                <a-select-option v-for="(item, index) in yearList" :key="index" :value="item">{{ item }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item>
              <a-select v-model="queryParam.field" placeholder="全部" allowClear>
                <a-select-option v-for="(item, index) in optionList" :key="index" :value="item.field">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item>
              <a-input v-model="queryParam.keywords" placeholder="请输入" allowClear />
            </a-form-item>
          </a-col>
          <a-col :md="9" :sm="12">
            <span class="table-page-search-buttons">
              <a-button type="primary" @click="searchQuery">搜索</a-button>
              <a-button @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <a-table bordered rowKey="_id" :dataSource="dataSource" :pagination="ipagination" :loading="loading" :columns="columns" @change="handleTableChange">
      <!-- <template slot="action" slot-scope="text, record">
        <a @click="showDetail(record)">数据来源</a>
      </template> -->
    </a-table>
    <!-- <DataDetailsDrawer ref="formDrawer" :dataSource="dataSource" /> -->
  </div>
</template>
<script>
import DataDetailsDrawer from './drawer/dataDetailsDrawer.vue'
import { DataCollectionListMixin } from '@/mixins/DataCollectionListMixin'
import api from '@/api/repository'
const yearColumn = [{ label: '年份', field: 'year' }]
export default {
  name: 'DataDetails',
  mixins: [DataCollectionListMixin],
  components: { DataDetailsDrawer },
  props: {
    formName: {
      type: String,
      default: ''
    },
    formId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      yearList: [],
      optionList: [],
      columns: [],
      dataSource: []
    }
  },

  mounted() {
    if (!this.formId) return
    this.getYearList()
    this.loadData(1)
  },

  methods: {
    loadData(arg) {
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      const params = this.getQueryParams()
      api
        .getDataList(this.formId, params)
        .then(res => {
          if (res.state) {
            if (res.value.content) {
              this.dataSource = this.formatTable(res.value.content.rows)
              if (res.value.content.total) {
                this.ipagination.total = res.value.content.total
              } else {
                this.ipagination.total = 0
              }
            }
            this.columns = this.formatHeader(yearColumn.concat(res.value.header))
            this.optionList = this.flatArr(res.value.header)
          } else {
            this.$message.warning(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 查询条件-表头数据下拉选项
    flatArr(arr, parent) {
      return arr.reduce((result, item) => {
        return result.concat(
          item.children ? this.flatArr(item.children, item) : parent ? { ...item, label: `${parent.label}.${item.label}`, field: `${parent.field}.${item.field}` } : item
        )
      }, [])
    },
    // 表头数据处理
    formatHeader(data) {
      if (!data) return null
      return data.map(item => {
        return {
          title: item.label,
          dataIndex: item.field,
          children: this.formatHeader(item.children),
          customRender: (text, row, index) => {
            if (row.rows) {
              if (text && text.type === 'single') {
                return text.value
              }
              return {
                children: text,
                attrs: {
                  rowSpan: row.rowIndex === 0 ? row.rows : 0
                }
              }
            }
            return text
          }
        }
      })
    },
    // 表格数据处理
    formatTable(data) {
      const newArr = []
      data.map(item => {
        let arrayFlag = false
        for (const key in item) {
          if (Array.isArray(item[key])) {
            item[key].forEach((subitem, index) => {
              arrayFlag = true
              for (const subkey in subitem) {
                if (subkey !== '_X_ROW_KEY') {
                  subitem[subkey] = {
                    type: 'single',
                    value: subitem[subkey]
                  }
                }
              }
              newArr.push({ ...item, ...subitem, _id: subitem._X_ROW_KEY, rows: item[key].length, rowIndex: index })
            })
          }
        }
        !arrayFlag && newArr.push({ ...item })
      })
      return newArr
    },
    getYearList() {
      api.getDataYearList(this.formId).then(res => {
        this.yearList = res.value
      })
    },
    // 查看数据来源
    showDetail(record) {
      this.$refs.formDrawer.show(this.formName, record)
    }
  }
}
</script>
<style scoped lang="less"></style>
