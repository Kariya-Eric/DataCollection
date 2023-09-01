<template>
  <div>
    <el-upload
      action="javascript:void(0)"
      :before-upload="beforeUpload"
      :on-change="onchange"
      :multiple="false"
      :auto-upload="false"
      :show-file-list="false"
    >
      <mbutton slot="trigger" name="导入文件" type="primary" />
    </el-upload>
    <mbutton type="text" name="下载模板" />
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import { getSheetCell, getHtml } from "../utils/excel";
export default {
  name: "UploadExcel",
  methods: {
    beforeUpload(file) {
      let fileName = file.name.substring(file.name.lastIndexOf(".") + 1);
      let isXlsx =
        fileName === "xlxs" || fileName === "xlsx" || fileName === "csv";
      if (!isXlsx) {
        this.$message.error("只允许上传excel");
      }
      return isXlsx;
    },

    onchange(file) {
      if (file.status !== "ready") return;
      const reader = new FileReader();
      reader.readAsBinaryString(file.raw);
      reader.onload = (re) => {
        const data = re.target.result;
        const upXlsx = XLSX.read(data, { type: "binary" });
        const cells = getSheetCell(upXlsx.Sheets.Sheet1);
        const html = getHtml(upXlsx.Sheets.Sheet1);
        this.$emit("update", { cells, html });
      };
    },
  },
};
</script>

<style>
</style>