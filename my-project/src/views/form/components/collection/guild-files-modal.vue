<template>
  <a-modal
    title="指南管理"
    v-if="visible"
    :visible="visible"
    :confirmLoading="loading"
    @cancel="handleCancel"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
    width="35%"
    destroyOnClose
  >
    <a-spin :spinning="loading">
      <a-alert message="可以一次选择多个文件,但是单个文件请勿超过15MB" type="info" show-icon style="margin-bottom: 12px"> </a-alert>
      <a-upload :show-upload-list="false" :multiple="true" @change="onchange" :customRequest="() => {}">
        <a-button type="primary" icon="upload">选取文件</a-button>
      </a-upload>
      <div class="fileDiv">
        <a-empty style="margin-top: 36px" description="请先上传指南" v-if="guides.length == 0"></a-empty>
        <ul v-else class="fileList">
          <li v-for="(file, index) in guides" :key="index" class="fileListItem">
            <a><a-icon type="file" />&nbsp;&nbsp;{{ file.name || file.fileName }}</a>
            <a-icon type="delete" @click="handleRemove(index)" />
          </li>
        </ul>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { DataCollectionModalMixin } from '@/mixins/DataCollectionModalMixin'
import { updateGuide } from '@/api/form'
import { fileUpload } from '@/api/common'
export default {
  name: 'GuildFilesModal',
  mixins: [DataCollectionModalMixin],
  data() {
    return {
      guides: [],
      id: ''
    }
  },
  methods: {
    show(form) {
      let info = Object.assign({}, form)
      this.id = info.id
      this.guides = JSON.parse(info.guidFiles) ? JSON.parse(info.guidFiles) : []
      this.visible = true
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.guides = []
    },

    handleOk() {
      let bigFile = this.guides.find(f => f.raw && f.size / 1024 / 1024 > 5)
      if (bigFile) {
        this.$message.error('文件【' + bigFile.name + '】过大，请压缩后再上传！')
        return
      }
      const formData = new FormData()
      this.guides.forEach(f => {
        if (f.originFileObj) {
          formData.append('files', f.originFileObj)
        }
      })
      this.loading = true
      fileUpload(formData)
        .then(res => {
          if (res.state) {
            let guidFiles = this.guides.filter(f => !f.originFileObj)
            guidFiles.push(...res.value)
            let param = { id: this.id, guidFiles: JSON.stringify(guidFiles) }
            updateGuide(param).then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('ok')
                this.close()
              }
            })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    },

    handleRemove(index) {
      this.guides.splice(index, 1)
    },

    onchange(info) {
      this.guides.push(info.file)
    }
  }
}
</script>

<style scoped lang="less">
.fileDiv {
  margin-top: 12px;
  background-color: #f5f8fd;
  height: 280px;
  border: 1px dashed #abcaf9;
  border-radius: 5px;
  overflow-y: auto;
}
.fileList {
  margin: 0;
  padding: 0;
  list-style: none;
  .fileListItem:first-child {
    margin-top: 12px;
  }
  .fileListItem {
    margin: 0 24px 12px 24px;
    .anticon-delete {
      float: right;
      color: red;
      margin-right: 8px;
      margin-top: 4px;
      cursor: pointer;
      opacity: 0;
    }
  }
  .fileListItem:hover {
    background-color: #d0e3ff;
    .anticon-delete {
      opacity: 0.75;
    }
  }
}
</style>
