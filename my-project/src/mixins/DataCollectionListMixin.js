import { postAction, deleteAction, downFile } from '@/api/api'
import storage from 'store'
import { BUTTON_LIST } from '@/store/mutation-types'

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
      if (!this.url || !this.url.list) {
        this.$message.error('请设置url.list属性！')
        return
      }
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      let params = this.getQueryParams()
      postAction(this.url.list, params)
        .then(res => {
          if (res.hasOwnProperty('state')) {
            if (res.state) {
              this.dataSource = res.value.rows || res.value
              if (res.value.total) {
                this.ipagination.total = res.value.total
              } else {
                this.ipagination.total = 0
              }
              this.customMethod()
            } else {
              this.$message.warning(res.message)
            }
          } else {
            this.dataSource = res
            this.ipagination.total = 0
          }
        })
        .finally(() => {
          this.onClearSelected()
          this.loading = false
        })
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
      if (!this.url || !this.url.deleteBatch) {
        this.$message.error('请设置url.deleteBatch属性')
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.waring('请至少选择一条记录')
        return
      } else {
        let ids = this.selectedRowKeys.join(',')
        let that = this
        that.loading = true
        deleteAction(this.url.deleteBatch, { ids })
          .then(res => {
            if (res.state) {
              that.$message.success(res.message)
              that.loadData()
            } else {
              that.$message.error(res.message)
            }
          })
          .finally(() => (that.loading = false))
      }
    },

    handleDelete(id) {
      if (!this.url || !this.url.delete) {
        this.$message.error('请设置url.delete属性')
        return
      }
      let that = this
      that.loading = true
      deleteAction(that.url.delete, { id })
        .then(res => {
          if (res.state) {
            that.$message.success(res.message)
            that.loadData()
          } else {
            that.$message.error(res.message)
          }
        })
        .finally(() => (that.loading = false))
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
    },

    customMethod() {},

    modalFormOk() {
      this.loadData()
      this.onClearSelected()
    },

    handleDetail(record, title) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = title
      this.$refs.modalForm.disabled = true
    },

    handleEdit(record, title) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = title
      this.$refs.modalForm.disabled = false
    },

    handleAdd(title) {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = title
      this.$refs.modalForm.disabled = false
    },

    handleExport(fileName) {
      if (!this.url || !this.url.exportUrl) {
        this.$message.error('请设置url.exportUrl!')
        return
      }
      this.loading = true
      let params = this.getQueryParams()
      downFile(this.url.exportUrl, params)
        .then(data => {
          if (!data) {
            this.$message.warning('文件下载失败！')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xlsx')
          } else {
            let url = window.URL.createObjectURL(new Blob([data], { type: 'appliaction/vnd.ms-excel' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName + '.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    beforeUpload() {
      return true
    },

    check(permission) {
      const buttonList = storage.get(BUTTON_LIST) || []
      return buttonList.indexOf(permission) > -1
    }
  }
}
