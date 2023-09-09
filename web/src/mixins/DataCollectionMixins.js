import { postAction, deleteAction, downFile } from '@/api/api'
import Vue from 'vue'
import { BUTTON_LIST } from '@/store/mutation-types'

// 用于简化展示表格的mixins
export const DataCollectionMixin = {
  data() {
    return {
      queryParam: {},
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0
      },
      loading: false,
      selectedRowKeys: [],
      sorter: [],
      headerStyle: {
        backgroundColor: '#F4F5F6'
      }
    }
  },

  methods: {
    searchQuery() {
      this.loadData(1)
    },

    // 重置查询条件
    searchReset() {
      this.queryParam = {}
      this.loadData(1)
    },

    loadData(arg) {
      if (!this.url || !this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若参数为1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1
      }
      this.loading = true
      let params = this.getQueryParams() //构造查询条件
      postAction(this.url.list, params)
        .then(res => {
          this.dataSource = res.value.rows || res.value
          this.ipagination.total = res.value.total
        })
        .catch(e => console.log('此处报错', e))
        .finally(() => {
          //清空选择框
          this.selectedRowKeys = []
          this.loading = false
        })
    },

    // 封装查询参数
    getQueryParams() {
      let pageBean = {
        page: this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        showTotal: true
      }
      return {
        params: Object.assign(this.queryParam),
        pageBean,
        sorter: this.sorter
      }
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },

    onSelectClear() {
      this.selectedRowKeys = []
    },

    check(value) {
      const buttonList = Vue.ls.get(BUTTON_LIST) || []
      for (let i = 0; i < buttonList.length; i++) {
        if (buttonList[i] == value) {
          return true
        }
      }
      return false
    },

    delBatch(id) {
      if (!this.url || !this.url.delBatch) {
        this.$message.error('请设置url.delBatch属性!')
        return
      }
      let ids = ''
      if (id) {
        ids = 'ids=' + id
      } else {
        this.selectedRowKeys.forEach(element => {
          ids += element.id + ','
        })
        ids = 'ids=' + ids.substring(0, ids.length - 1)
      }
      this.loading = true
      deleteAction(this.url.delBatch, ids)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = true
          this.loadData()
        })
    },

    handleDelete(row) {
      if (!this.url || !this.url.delete) {
        this.$message.error('请设置url.delete!')
        return
      }
      this.loading = true
      deleteAction(this.url.delete, 'id=' + row.id)
        .then(res => {
          if (res.state) {
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.loading = true
          this.loadData()
        })
    },

    handleDetail: function (record) {
      this.$refs.modalForm.info(record)
      this.$refs.modalForm.title = this.$refs.modalForm.name + '详情'
    },

    handleEdit: function (record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '修改' + this.$refs.modalForm.name
    },

    handleAdd: function () {
      this.$refs.modalForm.add()
      this.$refs.modalForm.title = '新增' + this.$refs.modalForm.name
    },

    handleExport() {
      if (!this.url || !this.url.exportUrl) {
        this.$message.error('请设置url.exportUrl!')
        return
      }
      this.loading = true
      let params = this.getQueryParams() //构造查询条件
      downFile(this.url.exportUrl, params)
        .then(data => {
          if (!data) {
            this.$message.warning('文件下载失败！')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), this.moduleName + '.xlsx')
          } else {
            let url = window.URL.createObjectURL(new Blob([data], { type: 'appliaction/vnd.ms-excel' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', '用户导出.xlsx')
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

    handleSort({ column, prop, order }) {
      if (order == 'ascending') {
        this.sorter = [{ property: prop, direction: 'ASC' }]
      } else if (order == null) {
        this.sorter = []
      } else {
        this.sorter = [{ property: prop, direction: 'DESC' }]
      }
      this.loadData()
    }
  }
}
