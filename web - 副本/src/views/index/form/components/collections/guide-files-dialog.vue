<template>
  <dc-dialog title="指南管理" @close="guides = []" :disabled="loading" :visible.sync="visible" @confirm="handleSubmit">
    <el-upload ref="upload" :file-list="guides" :auto-upload="false" :on-change="onchange" :show-file-list="false" multiple action="javascript:void(0)">
      <el-button slot="trigger" type="primary">选取文件</el-button>
      <div v slot="tip" class="el-upload__tip">可以一次选择多个文件,但是单个文件请勿超过5MB</div>
    </el-upload>
    <div class="fileDiv">
      <el-empty style="height: 100%" description="请先上传指南" v-if="guides.length == 0"></el-empty>
      <ul v-else class="fileList">
        <li v-for="(file, index) in guides" :key="index" class="fileListItem">
          <a><i class="el-icon-document"></i>&nbsp;&nbsp;{{ file.name || file.fileName }}</a>
          <i class="el-icon-close" @click="handleRemove(index)"></i>
        </li>
      </ul>
    </div>
  </dc-dialog>
</template>

<script>
import { updateGuide } from '@/api/form'
import { fileUpload } from '@/api/common'
export default {
  name: 'GuideFilesDialog',
  data() {
    return {
      loading: false,
      visible: false,
      id: '',
      guides: [],
      uploadUrl: ''
    }
  },
  methods: {
    show(form) {
      let info = Object.assign({}, form)
      this.id = info.id
      this.guides = JSON.parse(info.guidFiles) ? JSON.parse(info.guidFiles) : []
      this.visible = true
    },

    onchange(file) {
      this.guides.push(file)
    },

    handleRemove(index) {
      this.guides.splice(index, 1)
    },

    handleSubmit() {
      let bigFile = this.guides.find(f => f.raw && f.size / 1024 / 1024 > 5)
      if (bigFile) {
        this.$message.error('文件【' + bigFile.name + '】过大，请压缩后再上传！')
        return
      }
      const formData = new FormData()
      this.guides.forEach(f => {
        if (f.raw) {
          formData.append('files', f.raw)
        }
      })
      this.loading = true
      fileUpload(formData)
        .then(res => {
          if (res.state) {
            let guidFiles = this.guides.filter(f => !f.raw)
            guidFiles.push(...res.value)
            let param = { id: this.id, guidFiles: JSON.stringify(guidFiles) }
            updateGuide(param).then(res => {
              if (res.state) {
                this.$message.success(res.message)
                this.$emit('refresh')
                this.visible = false
              }
            })
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => (this.loading = false))
    }
  }
}
</script>

<style scoped lang="scss">
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
    .el-icon-close {
      float: right;
      margin-right: 8px;
      cursor: pointer;
      opacity: 0;
    }
  }
  .fileListItem:hover {
    background-color: #abcaf9;
    .el-icon-close {
      opacity: 0.75;
    }
  }
}
</style>
