<template>
  <div>
    <el-card shadow="always" class="app-card">
      <el-row style="margin-top: 12px; margin-bottom: 12px">
        <el-col :span="12">
          <el-descriptions
            style="margin-top: 12px; margin-left: 12px"
            :column="2"
          >
            <el-descriptions-item label="合集名称">{{
              collectionDetail.name
            }}</el-descriptions-item>
            <el-descriptions-item label="年份">{{
              collectionDetail.year
            }}</el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="12">
          <div style="float: right; margin-right: 12px">
            <el-button size="small" @click="updateFormCategory" type="primary"
              >配置表单大类</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="addForm"
              icon="el-icon-plus"
              >新建表单</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-table
        style="margin-top: 12px"
        :loading="loading"
        size="small"
        :border="true"
        :data="dataSource"
      >
        <el-table-column label="表单名称" prop="name" align="center" />
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
        <el-table-column label="表单类型" prop="type" align="center" />
        <el-table-column
          label="是否必填"
          prop="required"
          align="center"
          width="80px"
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.required" />
          </template>
        </el-table-column>
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
            />
          </template>
        </el-table-column>
        <el-table-column label="前置表单" prop="enabledFlag" align="center" />
        <el-table-column label="操作" align="center" width="250px">
          <template slot-scope="scope">
            <a href="javascript:;" @click="showForm(scope.row)">表单详情</a>
            <el-divider direction="vertical" />
            <a href="javascript:;" @click="formDetail(scope.row)">表单属性</a>
            <el-divider direction="vertical" />
            <a href="javascript:;">复制</a>
            <el-divider direction="vertical" />
            <el-popconfirm
              title="确认删除该表单吗？"
              @confirm="delForm(scope.row)"
            >
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagination="ipagination" @change="getFormList" />
    </el-card>
    <add-form-drawer ref="addFormDrawer" @refresh="getFormList" />
    <update-form-category ref="updateFormCategory" />
    <form-generator ref="formGenerator" @saveForm="saveForm" />
  </div>
</template>

<script>
import Pagination from "components/Pagination";
import AddFormDrawer from "./components/add-form-drawer";
import UpdateFormCategory from "./components/update-form-category";
import FormGenerator from "./form-generator/home";
import { getFormList, delForm, updateForm } from "@/api/form";
export default {
  name: "FormDetail",
  components: {
    Pagination,
    AddFormDrawer,
    UpdateFormCategory,
    FormGenerator,
  },
  data() {
    return {
      collectionDetail: {},
      formInfo: {},
      loading: false,
      dataSource: [],
      ipagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: [10, 20, 30],
        total: 0,
      },
    };
  },

  watch: {
    $route: {
      handler(newRoute) {
        if (newRoute.name == "formDetail") {
          this.getFormList(1);
        }
      },
    },
  },
  methods: {
    addForm() {
      this.$refs.addFormDrawer.show(this.collectionDetail);
    },

    updateFormCategory() {
      this.$refs.updateFormCategory.show(this.collectionDetail);
    },

    getFormList(args) {
      this.collectionDetail = this.$route.params;
      let pageBean = {
        page: args === 1 ? 1 : this.ipagination.current,
        pageSize: this.ipagination.pageSize,
        showTotal: true,
      };
      const param = { id: this.$route.params.id, pageBean };
      this.loading = true;
      getFormList(param)
        .then((res) => {
          if (res.state) {
            this.dataSource = res.value.rows;
            this.ipagination.total = res.value.total;
          }
        })
        .finally(() => (this.loading = false));
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

    formDetail(row) {
      this.$refs.addFormDrawer.show(this.collectionDetail, row);
    },

    showForm(row) {
      this.formInfo = row;
      this.$refs.formGenerator.show(row);
    },

    saveForm(formData) {
      const { fields } = formData;
      Reflect.deleteProperty(formData, "fields");
      Reflect.deleteProperty(formData, "formBtns");
      const params = {
        ...this.formInfo,
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
  },
};
</script>

<style></style>
