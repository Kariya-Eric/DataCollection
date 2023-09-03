<template>
  <div>
    <el-card shadow="always" class="app-card">
      <!-- Query Start -->
      <el-form
        label-width="80px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="年份">
          <el-select
            v-model="queryParam.year"
            placeholder="请选择年份"
            clearable
          >
            <el-option
              v-for="year in yearList"
              :key="year"
              :label="year"
              :value="year"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合集类型">
          <el-select
            v-model="queryParam.type"
            placeholder="请选择合集类型"
            clearable
          >
            <el-option label="教学基本状态数据" value="教学基本状态数据" />
            <el-option label="其他数据" value="其他数据" />
          </el-select>
        </el-form-item>
        <el-form-item label="合集名称">
          <el-input v-model="queryParam.name" placeholder="请输入合集名称" />
        </el-form-item>
        <mbutton type="primary" name="搜索" @click="searchQuery" />
        <mbutton type="primary" name="重置" @click="searchReset" />
      </el-form>
      <div class="listHeader">
        <span>合集列表</span>
        <div class="listHeaderButton">
          <mbutton
            @click="handleAdd"
            icon="新建"
            type="primary"
            name="新建合集"
          />
        </div>
      </div>

      <!-- Table Start -->
      <el-table
        v-loading="loading"
        :data="dataSource"
        class="listTable"
        :header-cell-style="headerStyle"
        @sort-change="handleSort"
      >
        <el-table-column label="合集名称" prop="name" align="center">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showCollectionDetail(scope.row)">{{
              scope.row.name
            }}</a>
          </template>
        </el-table-column>
        <el-table-column label="合集类型" prop="type" align="center" />
        <el-table-column
          label="年份"
          prop="year"
          align="center"
          sortable="custom"
          width="150"
        />
        <el-table-column label="填报指南" prop="guidFiles" align="center">
          <template slot-scope="scope" v-if="scope.row.guidFiles">
            <p
              v-for="(guidFile, index) in JSON.parse(scope.row.guidFiles)"
              :key="index"
            >
              <a href="javascript:;" @click="downloadGuid(guidFile)"
                ><ellipsis :value="guidFile.fileName" :length="40"
              /></a>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="启用" prop="enabled" align="center" width="100">
          <template slot-scope="scope">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.enabledFlag"
              @change="(val) => enableForm(val, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="330">
          <template slot-scope="scope">
            <menu-link @click="showCollectionDetail(scope.row)"
              >合集详情</menu-link
            >
            <menu-link @click="handleEdit(scope.row)">合集属性</menu-link>
            <menu-link @click="handleUpload(scope.row)">指南管理</menu-link>
            <el-popconfirm
              title="合集删除后不可恢复，是否确认删除？"
              @confirm="handleDelete(scope.row)"
            >
              <menu-link no-divider slot="reference"
                ><span style="color: #e23322">删除合集</span></menu-link
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
      <!-- Table End -->
    </el-card>
    <add-collection-dialog ref="modalForm" @refresh="loadData" />
    <guide-files-dialog ref="guideFilesDialog" @refresh="loadData" />
  </div>
</template>
<script>
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
import AddCollectionDialog from "./components/add-collection-dialog";
import GuideFilesDialog from "./components/guide-files-dialog.vue";
import { enableForm } from "@/api/form";
export default {
  name: "FormList",
  mixins: [DataCollectionMixin],
  components: { AddCollectionDialog, GuideFilesDialog },
  data() {
    return {
      url: {
        list: "/uc/api/formCollection/list",
        delete: "/uc/api/formCollection/delete",
      },
    };
  },

  created() {
    this.loadData(1);
  },

  computed: {
    yearList() {
      let years = new Set();
      this.dataSource.forEach((data) => years.add(data.year));
      return [...years].sort();
    },
  },

  methods: {
    showCollectionDetail(row) {
      this.$router.push({
        path: "/form/detail",
        query: { collectionInfo: JSON.stringify(row) },
      });
    },

    enableForm(val, row) {
      this.loading = true;
      enableForm({ id: row.id, enabledFlag: val })
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.value);
          }
        })
        .finally(() => {
          this.loadData();
          this.loading = false;
        });
    },

    handleUpload(row) {
      this.$refs.guideFilesDialog.show(row);
    },

    downloadGuid(file) {
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = file.filePath;
      link.setAttribute("download", file.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(file.filePath);
    },
  },
};
</script>

<style></style>
