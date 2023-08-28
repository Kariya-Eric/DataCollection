<template>
  <el-dialog
    :visible="visible"
    title="文件上传"
    @close="close"
    width="30%"
    height="400px"
    v-loading="loading"
  >
    <el-row>
      <el-col :span="18">
        <el-upload
          ref="upload"
          :file-list="fileList"
          :auto-upload="false"
          :on-remove="handleRemove"
          :on-change="onchange"
          :multiple="multiple"
          action="javascript:void(0)"
        >
          <mbutton slot="trigger" name="选取文件" type="primary" />
          <mbutton
            style="margin-left: 10px"
            type="success"
            @click="submitUpload"
            name="上传到服务器"
          />
          <div v slot="tip" class="el-upload__tip" v-if="tips != ''">
            {{ tips }}
          </div>
        </el-upload>
      </el-col>
      <el-col :span="6">
        <a class="downHref" @click="downloadTemp">下载导入模板</a>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { fileUpload, downloadTemp } from "@/api/common";
export default {
  name: "Mupload",
  props: {
    tips: {
      type: String,
      default: "",
    },
    maxSize: {
      type: Number,
      default: 10,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    uploadUrl: {
      type: String,
      required: true,
    },
    downTempUrl: {
      type: String,
      required: true,
    },
    moduleName: {
      type: String,
      default: "模板",
    },
  },
  data() {
    return {
      loading: true,
      visible: false,
      fileList: [],
    };
  },
  methods: {
    show() {
      this.visible = true;
    },
    submitUpload() {
      if (this.uploadUrl) {
        this.$message.error("请设置文件上传路径!");
        return;
      }
      const formData = new FormData();
      this.fileList.forEach((f) => {
        formData.append("files", f.raw);
      });
      this.loading = true;
      fileUpload(this.uploadUrl, formData)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.close();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    onchange(file) {
      if (file.size / 1024 / 1024 < this.maxSize) {
        if (this.multiple) {
          this.fileList.push(file);
        } else {
          this.fileList = [file];
        }
      } else {
        this.$message.warning("文件过大");
        this.handleRemove(file);
      }
    },

    handleRemove(file) {
      this.fileList = this.fileList.filter((f) => file.name !== f.name);
    },

    close() {
      this.fileList = [];
      this.visible = false;
    },

    downloadTemp() {
      if (!this.downTempUrl) {
        this.$message.error("请设置下载模板路径!");
        return;
      }
      downloadTemp(this.downTempUrl).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败！");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], { type: "application/vnd.ms-excel" }),
            this.moduleName + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], { type: "appliaction/vnd.ms-excel" })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", this.moduleName + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.downHref {
  float: right;
  line-height: 32px;
}
</style>
