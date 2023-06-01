<template>
  <el-dialog title="配置表单大类" :visible="visible" @close="close" width="35%">
    <div class="formDiv">
      <el-form
        ref="formCategoryForm"
        :model="formCategoryForm"
        label-width="80px"
        size="small"
        :rules="rules"
      >
        <el-form-item prop="name" label="所属合集">
          <el-input v-model="formCategoryForm.name" :disabled="true" />
        </el-form-item>
        <el-form-item prop="type" label="合集类型">
          <el-input v-model="formCategoryForm.type" :disabled="true" />
        </el-form-item>
        <el-form-item prop="year" label="年份">
          <el-input v-model="formCategoryForm.year" :disabled="true" />
        </el-form-item>
        <el-form-item label="表单大类">
          <el-button
            size="small"
            type="primary"
            style="margin-bottom: 8px"
            icon="el-icon-plus"
            @click="addFormCategory"
            >添加大类</el-button
          >
          <el-table
            size="small"
            :border="true"
            height="220"
            :loading="loading"
            :data="formCategoryForm.dataSource"
          >
            <el-table-column type="index" align="center" />
            <el-table-column label="表单大类名称" align="center">
              <template slot-scope="scope">
                <template v-if="scope.row.isEdit">
                  <el-input
                    v-model="scope.row.name"
                    placeholder="请输入表单大类"
                  />
                </template>
                <template v-else>
                  {{ scope.row.name }}
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120px">
              <template slot-scope="scope">
                <a
                  href="javascript:;"
                  v-if="scope.row.isEdit"
                  @click="save(scope.row)"
                  >保存</a
                >
                <a href="javascript:;" v-else @click="edit(scope.row)">编辑</a>
                <el-divider direction="vertical" />
                <el-popconfirm
                  @confirm="delRow(scope.row)"
                  title="确定要删除该行吗?"
                >
                  <a href="javascript:;" slot="reference">删除</a>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import {
  getFormCategories,
  updateFormCategory,
  addFormCategory,
  delFormCategory,
} from "@/api/form";
export default {
  name: "UpdateFormCategory",
  data() {
    return {
      loading: false,
      visible: false,
      formCategoryForm: {
        dataSource: [],
      },
      rules: {
        name: [{ required: true, message: "请输入合集名称" }],
        type: [{ required: true, message: "请选择合集类型" }],
        year: [{ required: true, message: "请选择年份" }],
      },
    };
  },
  methods: {
    show(formCategory) {
      this.formCategoryForm = { ...formCategory, ...this.formCategoryForm };
      this.loadFormCategory();
      this.visible = true;
    },

    close() {
      this.visible = false;
      this.formCategoryForm = { dataSource: [] };
    },

    delRow(row) {
      let param = "id=" + row.id;
      delFormCategory(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => this.loadFormCategory());
    },

    save(row) {
      if (row.name == undefined || row.name.trim() == "") {
        this.$message.warning("表单大类名称不能为空");
      } else {
        if (row.id) {
          //修改
          let param = { id: row.id, name: row.name };
          updateFormCategory(param)
            .then((res) => {
              if (res.state) {
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => this.loadFormCategory());
        } else {
          //新增
          let param = {
            name: row.name,
            formCollectionId: this.formCategoryForm.id,
          };
          addFormCategory(param)
            .then((res) => {
              if (res.state) {
                this.$message.success(res.message);
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => this.loadFormCategory());
        }
      }
    },

    edit(row) {
      row.isEdit = !row.isEdit;
    },

    addFormCategory() {
      let data = {
        name: undefined,
        isEdit: true,
      };
      this.formCategoryForm.dataSource.push(data);
    },

    loadFormCategory() {
      let pageBean = {
        page: 1,
        pageSize: 1000,
        showTotal: true,
      };
      const param = { id: this.formCategoryForm.id, pageBean };
      this.loading = true;
      getFormCategories(param)
        .then((res) => {
          if (res.state) {
            this.formCategoryForm.dataSource = [];
            for (let i = 0; i < res.value.rows.length; i++) {
              let row = res.value.rows[i];
              let data = { ...row, isEdit: false };
              this.formCategoryForm.dataSource.push(data);
            }
          }
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style lang="scss" scoped>
.formDiv {
  margin: 0 24px;
}
</style>