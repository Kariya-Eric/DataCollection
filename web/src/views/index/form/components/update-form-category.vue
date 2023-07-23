<template>
  <el-dialog title="配置表单大类" :visible="visible" @close="close" width="40%">
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
          <vxe-toolbar>
            <template #buttons>
              <vxe-button icon="vxe-icon-square-plus" @click="insertRow()"
                >添加大类</vxe-button
              >
            </template>
          </vxe-toolbar>
          <vxe-table
            border
            resizable
            size="small"
            show-overflow
            ref="xTable"
            max-height="400"
            :row-config="{ isHover: true }"
            :data="formCategoryForm.dataSource"
            align="center"
          >
            <vxe-column field="index" width="60">
              <template #default="{ row }">
                <span>{{ row.index + 1 }}</span>
              </template>
            </vxe-column>
            <vxe-column field="name" title="表单大类名称"></vxe-column>
            <vxe-column title="操作" width="220" show-overflow>
              <template #default="{ row }">
                <a href="javascript:;" @click="editRow(row)">编辑</a>
                <el-divider direction="vertical" />
                <el-popconfirm
                  @confirm="removeRow(row)"
                  title="确认删除该条数据吗"
                >
                  <a href="javascript:;" slot="reference">删除</a>
                </el-popconfirm>
                <el-divider direction="vertical" v-if="row.index != 0" />
                <a href="javascript:;" @click="upRow(row)" v-if="row.index != 0"
                  >上移</a
                >
                <el-divider
                  direction="vertical"
                  v-if="row.index != formCategoryForm.dataSource.length - 1"
                />
                <a
                  href="javascript:;"
                  @click="downRow(row)"
                  v-if="row.index != formCategoryForm.dataSource.length - 1"
                  >下移</a
                >
              </template>
            </vxe-column>
          </vxe-table>
          <vxe-modal
            v-model="showEdit"
            :title="selectRow ? '编辑表单大类' : '新增表单大类'"
            width="600"
            :loading="submitLoading"
            resize
            destroy-on-close
          >
            <template #default>
              <vxe-form
                :data="formData"
                :rules="formRules"
                @submit="submitEvent"
              >
                <vxe-form-item
                  field="name"
                  :span="24"
                  title="表单大类名称"
                  :item-render="{}"
                >
                  <template #default="{ data }">
                    <vxe-input
                      v-model="data.name"
                      placeholder="请输入表单大类名称"
                    ></vxe-input>
                  </template>
                </vxe-form-item>
                <vxe-form-item align="center" title-align="left" :span="24">
                  <template #default>
                    <vxe-button type="submit">提交</vxe-button>
                    <vxe-button type="reset">重置</vxe-button>
                  </template>
                </vxe-form-item>
              </vxe-form>
            </template>
          </vxe-modal>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click="handleSubmit"
        >提交</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import {
  getFormCategories,
  updateFormCategory,
  addFormCategory,
  delFormCategory,
  saveFormCategories,
} from "@/api/form";
export default {
  name: "UpdateFormCategory",
  data() {
    return {
      showEdit: false,
      selectRow: null,
      submitLoading: false,
      tableData: [],
      showFlag: false,
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
      formData: {
        name: "",
      },
      formRules: {
        name: [{ required: true, message: "请输入表单大类名称" }],
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
      this.showFlag = false;
      this.formCategoryForm = { dataSource: [] };
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
              let data = { ...row, index: i };
              this.formCategoryForm.dataSource.push(data);
            }
          }
        })
        .finally(() => (this.loading = false));
    },

    editRow(row) {
      this.formData = {
        id: row.id,
        name: row.name,
        sort: row.sort,
      };
      this.selectRow = row;
      this.showEdit = true;
    },

    removeRow(row) {
      this.loading = true;
      let param = "id=" + row.id;
      delFormCategory(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.loadFormCategory();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },
    upRow(row) {
      let before = this.formCategoryForm.dataSource.slice(0, row.index - 1);
      let after = this.formCategoryForm.dataSource.slice(
        row.index + 1,
        this.formCategoryForm.dataSource.length
      );
      let rowBefore = this.formCategoryForm.dataSource.filter(
        (data) => data.index == row.index - 1
      )[0];
      row.index = row.index - 1;
      rowBefore.index = rowBefore.index + 1;
      this.formCategoryForm.dataSource = [...before, row, rowBefore, ...after];
    },
    downRow(row) {
      let before = this.formCategoryForm.dataSource.slice(0, row.index);
      let after = this.formCategoryForm.dataSource.slice(
        row.index + 2,
        this.formCategoryForm.dataSource.length
      );
      let rowAfter = this.formCategoryForm.dataSource.filter(
        (data) => data.index == row.index + 1
      )[0];
      row.index = row.index + 1;
      rowAfter.index = rowAfter.index - 1;
      this.formCategoryForm.dataSource = [...before, rowAfter, row, ...after];
    },
    insertRow() {
      this.formData = {
        name: "",
        sort: this.formCategoryForm.dataSource.length + 1,
      };
      this.selectRow = null;
      this.showEdit = true;
    },
    submitEvent() {
      this.submitLoading = true;
      this.showEdit = false;
      if (!this.selectRow) {
        let param = {
          name: this.formData.name,
          formCollectionId: this.formCategoryForm.id,
          sort: this.formData.sort,
        };
        addFormCategory(param)
          .then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.loadFormCategory();
            } else {
              this.$message.error(res.message);
            }
          })
          .finally(() => (this.submitLoading = false));
      } else {
        updateFormCategory(this.formData)
          .then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.loadFormCategory();
            } else {
              this.$message.error(res.message);
            }
          })
          .finally(() => (this.submitLoading = false));
      }
    },

    handleSubmit() {
      this.loading = true;
      let param = {
        formCollectionId: this.formCategoryForm.id,
        categories: this.formCategoryForm.dataSource.map((data) => {
          data.sort = data.index;
          delete data.index;
          return data;
        }),
      };
      saveFormCategories(param)
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
  },
};
</script>

<style lang="scss" scoped>
.formDiv {
  margin: 0 24px;
}
</style>
