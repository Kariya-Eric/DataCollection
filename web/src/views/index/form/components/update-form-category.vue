<template>
  <el-dialog
    title="配置表单大类"
    :visible="visible"
    @close="close"
    width="40%"
    @open="open"
  >
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
      </el-form>
      <el-row style="margin-bottom: 8px"
        ><span style="margin-left: 12px">表单大类</span
        ><Mbutton
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 12px"
          @click="insertRow"
          name="添加"
        />
      </el-row>
      <vxe-table
        border
        ref="xTable"
        align="center"
        size="medium"
        resizable
        keep-source
        show-overflow
        max-height="400"
        :edit-rules="tableRules"
        :edit-config="{ trigger: 'click', mode: 'cell' }"
        :data="formCategoryForm.dataSource"
      >
        <vxe-column width="60">
          <template #default>
            <span class="drag-btn"><i class="el-icon-s-operation"></i></span>
          </template>
          <template #header>
            <el-tooltip
              content="按住后可以上下拖动排序！"
              effect="dark"
              placement="right"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column
          field="name"
          title="表单大类名称"
          :edit-render="{ autofocus: '.el-input__inner' }"
        >
          <template #edit="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100" show-overflow>
          <template #default="{ row }">
            <el-popconfirm title="确认删除该行吗？" @confirm="deleteRow(row)">
              <a href="javascript:;" slot="reference">删除</a>
            </el-popconfirm>
          </template>
        </vxe-column>
      </vxe-table>
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
import Sortable from "sortablejs";
import { getFormCategories, saveFormCategories } from "@/api/form";
export default {
  name: "UpdateFormCategory",
  data() {
    return {
      submitLoading: false,
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

      tableRules: {
        name: [{ required: true, message: "表单大类名不能为空" }],
      },
    };
  },

  methods: {
    open() {
      this.rowDrop();
    },

    rowDrop() {
      this.$nextTick(() => {
        const xTable = this.$refs.xTable;
        this.sortable = Sortable.create(
          xTable.$el.querySelector(".body--wrapper>.vxe-table--body tbody"),
          {
            handle: ".drag-btn",
            onEnd: ({ newIndex, oldIndex }) => {
              const tableData = xTable.getTableData().tableData;
              const currRow = tableData.splice(oldIndex, 1)[0];
              tableData.splice(newIndex, 0, currRow);
              this.formCategoryForm.dataSource = [];
              this.$nextTick(
                () => (this.formCategoryForm.dataSource = tableData)
              );
            },
          }
        );
      });
    },

    show(formCategory) {
      this.formCategoryForm = { ...formCategory, ...this.formCategoryForm };
      this.loadFormCategory();
      this.visible = true;
    },

    close() {
      this.visible = false;
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
            this.formCategoryForm.dataSource = res.value.rows;
          }
        })
        .finally(() => (this.loading = false));
    },

    async handleSubmit() {
      const $table = this.$refs.xTable;
      const errMap = await $table.validate().catch((errMap) => errMap);
      if (errMap) {
        return;
      }
      let data = $table.getTableData().tableData;
      for (let i = 0; i < data.length; i++) {
        data[i].sort = i;
      }
      let param = {
        formCollectionId: this.formCategoryForm.id,
        categories: data,
      };
      saveFormCategories(param)
        .then((res) => {
          if (res.state) {
            this.$message.success(res.message);
            this.$emit("refresh");
            this.close();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => (this.loading = false));
    },

    async insertRow() {
      const $table = this.$refs.xTable;
      const errMap = await $table.validate().catch((errMap) => errMap);
      if (errMap) {
        return;
      }
      const newRecord = {};
      const { row: newRow } = await $table.insertAt(newRecord, -1);
      await $table.setActiveRow(newRow);
    },

    async deleteRow(row) {
      const $table = this.$refs.xTable;
      await $table.remove(row);
    },
  },
};
</script>

<style lang="scss" scoped>
.formDiv {
  margin: 0 24px;
}
</style>
