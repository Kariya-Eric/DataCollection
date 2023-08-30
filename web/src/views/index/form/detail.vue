<template>
  <div>
    <span class="cardTitle">
      <span class="titleYear">&nbsp;&nbsp;{{ collectionDetail.year }}</span>
      {{ collectionDetail.name }}
    </span>
    <el-card shadow="always" class="app-card" style="margin-top: 16px">
      <el-form
        label-width="80px"
        size="small"
        :inline="true"
        class="headerForm"
      >
        <el-form-item label="表单大类">
          <el-select
            v-model="queryParam.listCategory"
            placeholder="请选择表单大类"
            clearable
          >
            <el-option
              v-for="item in listCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="前置表单">
          <el-select
            v-model="queryParam.type"
            placeholder="请选择前置表单"
            clearable
          >
            <el-option label="全部" value="全部" />
          </el-select>
        </el-form-item>
        <el-form-item label="表单名称">
          <el-input v-model="queryParam.name" placeholder="请输入表单名称" />
        </el-form-item>
        <mbutton type="primary" name="搜索" @click="searchQuery" />
        <mbutton type="primary" name="重置" @click="searchReset" />
      </el-form>

      <div class="listHeader">
        <span>合集详情</span>
        <div class="listHeaderButton">
          <mbutton
            @click="updateFormCategory"
            type="primary"
            icon="配置大类"
            name="配置表单大类"
          />
          <mbutton
            type="primary"
            icon="复制"
            name="复制表单"
            @click="copyForm"
          />
          <mbutton
            @click="handleAdd"
            icon="新建"
            type="primary"
            name="新建表单"
          />
        </div>
      </div>

      <el-table
        :loading="loading"
        class="listTable"
        :header-cell-style="headerStyle"
        :data="dataSource"
      >
        <el-table-column label="表单名称" prop="name" align="center">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showForm(scope.row)">{{
              scope.row.name
            }}</a>
          </template>
        </el-table-column>
        <el-table-column
          label="表单大类"
          prop="formCategories"
          align="center"
        />
        <el-table-column
          label="统计时间类型"
          prop="collectTimeType"
          align="center"
        />
        <el-table-column label="表单类型" prop="type" align="center">
          <template slot-scope="scope">
            <el-tag
              size="medium"
              :class="`tag${scope.row.type === '固定表单' ? 'Fix' : 'Float'}`"
              >{{ scope.row.type }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="是否必填"
          prop="required"
          align="center"
          width="80px"
        >
          <template slot-scope="scope">
            {{ scope.row.required ? `是` : `否` }}
          </template>
        </el-table-column>
        <el-table-column label="前置表单" align="center" />
        <el-table-column
          label="启用"
          prop="enabledFlag"
          align="center"
          width="80px"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabledFlag"
              :inactive-value="0"
              :active-value="1"
              @change="(val) => enableFormCollection(val, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="330px">
          <template slot-scope="scope">
            <menu-link @click="showForm(scope.row)">表单详情</menu-link>
            <menu-link @click="handleEdit(scope.row)">表单属性</menu-link>
            <menu-link>下载模板</menu-link>
            <el-popconfirm
              title="表单删除后不可恢复，是否确认删除？"
              @confirm="delForm(scope.row)"
            >
              <menu-link no-divider slot="reference"
                ><span style="color: #e23322">删除表单</span></menu-link
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="loadData" />
    </el-card>
    <add-form-dialog
      ref="modalForm"
      @refresh="loadData"
      :collection="collectionDetail"
      :categorys="listCategories"
    />
    <update-form-category ref="updateFormCategory" @refresh="loadCategories" />
    <form-generator-dialog ref="formGeneratorDialog" @refresh="loadData" />
    <copy-form-dialog ref="copyFormDialog" />
  </div>
</template>

<script>
import AddFormDialog from "./components/add-form-dialog";
import UpdateFormCategory from "./components/update-form-category";
import {
  getFormList,
  delForm,
  updateForm,
  listFormCategories,
} from "@/api/form";
import FormGeneratorDialog from "./components/form-generator-dialog.vue";
import CopyFormDialog from "./components/copy-form-dialog.vue";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
export default {
  name: "FormDetail",
  mixins: [DataCollectionMixin],
  components: {
    AddFormDialog,
    UpdateFormCategory,
    FormGeneratorDialog,
    CopyFormDialog,
  },
  data() {
    return {
      collectionDetail: {},
      url: {
        list: "",
      },
      listUrl: "/uc/api/form/listByCollection/",
      listCategories: [],
      formInfo: {},
      drawingList: [],
    };
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "formDetail") {
          this.collectionDetail = JSON.parse(newRoute.query.collectionInfo);
          this.url.list = this.listUrl + this.collectionDetail.id;
          this.loadCategories();
          this.loadData(1);
        }
      },
      immediate: true,
      deep: true,
    },
  },

  methods: {
    loadCategories() {
      listFormCategories(this.collectionDetail.id).then((res) => {
        if (res.state) {
          this.listCategories = res.value
            .sort((a, b) => a.sort - b.sort)
            .map((item) => ({
              ...item,
              name: item.sort + 1 + "." + item.name,
            }));
        }
      });
    },

    updateFormCategory() {
      this.$refs.updateFormCategory.show(this.collectionDetail);
    },

    delForm(row) {
      let param = "id=" + row.id;
      this.loading = true;
      delForm(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.loading = false;
          this.getFormList();
        });
    },

    showForm(row) {
      listFormCategories(this.collectionDetail.id).then((res) => {
        if (res.state) {
          row.listCategories = res.value;
          this.$refs.formGeneratorDialog.show(row);
        }
      });
    },

    saveForm(formData, formInfo) {
      const { fields } = formData;
      Reflect.deleteProperty(formData, "fields");
      Reflect.deleteProperty(formData, "formBtns");
      const params = {
        ...formInfo,
        formProperties: JSON.stringify(formData),
        componentProperties: JSON.stringify(fields),
      };
      this.loading = true;
      updateForm(params)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.getFormList();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },
    goBack() {
      this.$router.go(-1);
    },

    enableFormCollection(val, row) {
      let param = { id: row.id, enabledFlag: val };
    },

    copyForm() {
      this.$refs.copyFormDialog.show();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-tag {
  border-radius: 13px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
}
.tagFloat {
  color: #2f68bd;
  background-color: #e7f2ff;
  border-color: #2f68bd;
}
.tagFix {
  color: #2b9e77;
  background-color: #e7f7ec;
  border-color: #2b9e77;
}

.titleYear {
  display: inline-block;
  width: 54px;
  height: 22px;
  background: linear-gradient(360deg, #2f68bd 0%, #76a8f4 100%);
  border-radius: 40px 2px 40px 2px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  line-height: 22px;
  margin-right: 10px;
}
</style>
