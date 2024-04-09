<template>
  <a-modal title="导出" v-if="visible" :visible="visible" @cancel="handleCancel" @ok="handleOk" :maskClosable="false" :keyboard="false" width="35%" destroyOnClose>
    <a-spin :spinning="loading">
      <a-form-model ref="form" v-bind="layout" :model="model">
        <a-form-model-item label="任务名称">
          <a-input v-model="model.name" disabled />
        </a-form-model-item>
        <a-form-model-item label="任务类型">
          <a-input v-model="model.type" disabled />
        </a-form-model-item>
        <a-form-model-item label="统计时间">
          <a-input v-model="model.year" disabled />
        </a-form-model-item>
        <a-form-model-item label="表单名称">
          <a-select v-model="model.formIds" placeholder="默认全选，可多选，可搜索" allowClear mode="multiple" show-search :filter-option="filterOption">
            <a-select-option v-for="f in dataSource" :key="f.id" :value="f.id">{{ f.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { getTaskFormList, exportData } from '@/api/task'
export default {
  name: 'TaskExportModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      visible: false,
      loading: false,
      dataSource: [],
      taskInfo: {}
    }
  },
  methods: {
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    show(info) {
      this.taskInfo = info
      this.model = Object.assign({}, info)
      this.loading = true
      let query = {
        taskId: this.taskInfo.id,
        formCollectionId: this.taskInfo.formCollectionId
      }
      getTaskFormList(query)
        .then(res => {
          if (res.state) {
            this.dataSource = res.value.map(item => {
              let result = { id: item.formId, name: item.formName }
              return result
            })
          }
        })
        .finally(() => (this.loading = false))
      this.visible = true
    },

    handleCancel() {
      this.visible = false
    },

    handleOk() {
      let formIds
      if (this.model.formIds && this.model.formIds.length > 0) {
        formIds = this.model.formIds
      } else {
        formIds = this.dataSource.map(item => item.id)
      }
      let query = { taskId: this.taskInfo.id, formIds }
      this.loading = true
      exportData(query)
        .then(data => {
          if (!data) {
            this.$message.warning('导出数据失败！')
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data], { type: 'application/vnd.ms-excel' }), fileName + '.xlsx')
          } else {
            let url = window.URL.createObjectURL(new Blob([data], { type: 'appliaction/vnd.ms-excel' }))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', this.taskInfo.name + '.xlsx')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
          }
          this.handleCancel()
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style lang="less" scoped>
.import-modal {
  color: red;
  /deep/.ant-modal-body {
    .ant-form-item {
      display: flex;
      margin-bottom: 20px;
    }
    .ant-form-item-label,
    .ant-form-item-control {
      line-height: 32px;
    }
    .ant-form-item-label label {
      margin-right: 10px;
      &::before {
        content: '* ';
        color: rgba(234, 51, 34, 0.85);
      }
      &::after {
        display: none;
      }
    }
    .ant-row {
      display: flex;
      .ant-col {
        position: static;
      }
      button {
        min-width: 104px;
      }
    }
    .ant-upload-list {
      position: absolute;
      width: calc(100% - 20px);
      margin-top: 21px;
      padding: 0 10px;
      height: 208px;
      overflow-y: auto;
    }
  }
  /deep/.ant-modal-footer {
    text-align: right !important;
  }
  .import-result-list {
    margin-top: 20px;
    height: 210px;
    background: #f4f8ff;
    border-radius: 4px;
    border: 1px dashed #bdceee;
    padding: 10px;
  }
  .import-file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    height: 30px;
    transition: background-color 0.3s;
    &:first-child {
      margin-top: 0;
    }
    .anticon {
      display: none;
    }
    &:hover {
      background-color: #edf6fc;
      .anticon {
        display: block;
      }
    }
  }
}
</style>
