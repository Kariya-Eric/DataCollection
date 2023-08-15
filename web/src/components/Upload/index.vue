<template>
  <el-dialog
    :visible="visible"
    title="文件上传"
    @close="close"
    width="30%"
    height="400px"
    v-loading="loading"
  >
    <el-upload
      ref="upload"
      :file-list="fileList"
      :auto-upload="false"
      :on-remove="handleRemove"
      :on-change="onchange"
      multiple
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
  </el-dialog>
</template>

<script>
import { fileUpload } from "@/api/common";
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
      const formData = new FormData();
      this.fileList.forEach((f) => {
        formData.append("files", f.raw);
      });
      this.loading = true;
      fileUpload(formData)
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
        this.fileList.push(file);
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
  },
};
</script>

<style scoped lang="less"></style>
