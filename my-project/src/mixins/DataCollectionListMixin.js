import { postAction, deleteAction, downFile, getAction } from '@/api/api'

export const DataCollectionListMixin = {
  data() {
    return {
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + '共' + total + '条'
        },
        showQuickJumper: true,
        showSizeJumper: true,
        total: 0
      },
      isorter: [],
      queryParam: {},
      loading: true,
      selectedRowKeys: [],
      selectionRows: []
    }
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性！')
        return
      }
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      let params = this.getQueryParams()
      if (this.url.method == 'get') {
        getAction(this.url.list, params)
          .then(res => {
            if (res.state) {
              this.dataSource = res.value.rows || res.value
              if (res.value.total) {
                this.ipagination.total = res.value.total
              } else {
                this.ipagination.total = 0
              }
            } else {
              this.$message.waring(res.message)
            }
          })
          .finally(() => (this.loading = false))
      } else {
        postAction(this.url.list, params)
          .then(res => {
            if (res.state) {
              this.dataSource = res.value.rows || res.value
              if (res.value.total) {
                this.ipagination.total = res.value.total
              } else {
                this.ipagination.total = 0
              }
            } else {
              this.$message.waring(res.message)
            }
          })
          .finally(() => (this.loading = false))
      }
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },

    onClearSelected() {
      this.selectedRowKeys = []
      this.selectionRows = []
    },

    searchQuery() {
      this.loadData(1)
    },

    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },

    batchDel() {
      if (!this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.waring('请至少选择一条记录')
        return
      } else {
        let ids = ''
      }
    },

    handleDelete(id) {
      if (!this.url.delete) {
        this.$message.error('请设置url.delete属性')
        return
      }
    },

    getQueryParams() {
      let pageBean = {
        page: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        showTotal: true
      }
      return {
        params: Object.assign(this.queryParam),
        pageBean,
        sorter: this.isorter
      }
    },

    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData()
    }
  }
}
