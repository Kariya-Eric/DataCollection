<template>
  <el-dialog
    title="复制表单"
    append-to-body
    :visible="visible"
    v-if="visible"
    @close="close"
    width="30%"
  >
    <el-form
      :model="copyForm"
      ref="copyForm"
      :rules="rules"
      v-loading="loading"
      label-width="100px"
      size="small"
    >
      <el-form-item label="合集名称" prop="formCollectionId">
        <Mselect
          v-model="copyForm.formCollectionId"
          placeholder="请选择合集"
          :options="formCollectionList"
          :optionProps="{ label: 'name', value: 'id' }"
          @input="getFormList"
        />
      </el-form-item>
      <el-form-item label="表单名称" prop="formIds">
        <el-select
          v-model="copyForm.formIds"
          placeholder="请选择合表单名称"
          style="width: 100%"
          multiple
          filterable
        >
          <el-checkbox
            class="selectAll"
            v-model="checked"
            @change="selectAll"
            :indeterminate="!checked && copyForm.formIds.length != 0"
            >全选</el-checkbox
          >
          <el-option
            v-for="item in formList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <Mbutton @click="close" name="取消" />
      <Mbutton type="primary" @click="handleSubmit" name="提交" />
    </div>
  </el-dialog>
</template>

<script>
import { formCollectionList, getFormList, copyForm } from "@/api/form";
export default {
  name: "CopyFormDialog",
  data() {
    return {
      visible: false,
      loading: false,
      copyForm: {
        formCollectionId: "",
        formIds: [],
      },
      formCollectionList: [],
      formList: [],
      rules: {
        formCollectionId: [{ required: true, message: "请选择合集" }],
        formIds: [{ required: true, message: "请选择表单" }],
      },
    };
  },

  computed: {
    checked: {
      get() {
        return this.copyForm.formIds.length == this.formList.length;
      },
      set() {},
    },
  },

  methods: {
    close() {
      this.visible = false;
      this.$refs.copyForm.resetFields();
      this.copyForm = {
        formCollectionId: "",
        formIds: [],
      };
      this.formCollectionList = [];
      this.formList = [];
    },

    show() {
      this.getCollectionList();
      this.visible = true;
    },

    getCollectionList() {
      formCollectionList({}).then((res) => {
        if (res.state) {
          this.formCollectionList = res.value.rows;
        }
      });
    },

    handleSubmit() {
      this.$refs.copyForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          let param = { ...this.copyForm };
          param.formIds = param.formIds.join(".");
          copyForm(param)
            .then((res) => {
              if (res.state) {
                this.$message.success(res.message);
                this.close();
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => (this.loading = false));
        }
      });
    },

    getFormList(val) {
      let param = { id: val, searchParam: {} };
      getFormList(param).then((res) => {
        if (res.state) {
          this.formList = res.value.rows;
          this.$nextTick(() => this.$refs.copyForm.clearValidate(["formIds"]));
        }
      });
    },

    selectAll(val) {
      if (val) {
        this.copyForm.formIds = this.formList.map((item) => item.id);
      } else {
        this.copyForm.formIds = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.selectAll {
  margin: 8px 16px 8px 16px;
}
</style>