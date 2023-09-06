<template>
  <el-dialog :visible="visible" title="添加菜单" @close="close" width="40%">
    <el-form
      ref="menuForm"
      :model="menuForm"
      label-width="120px"
      :rules="rule"
      size="small"
      v-loading="loading"
    >
      <el-form-item label="菜单名称" prop="name"
        ><el-input v-model="menuForm.name"
      /></el-form-item>
      <el-form-item
        label="父级菜单"
        v-if="menuForm.parentId != undefined"
        prop="parentId"
      >
        <select-tree
          :options="menuList"
          :value="menuForm.parentId"
          @getValue="getSelectedValue"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="别名" prop="alias"
        ><el-input v-model="menuForm.alias"
      /></el-form-item>
      <el-form-item label="URL" prop="menuUrl"
        ><el-input v-model="menuForm.menuUrl"
      /></el-form-item>
      <el-form-item label="模板URL" prop="templateUrl"
        ><el-input v-model="menuForm.templateUrl"
      /></el-form-item>
      <!-- <el-form-item label="图标"></el-form-item> -->
      <el-form-item label="排序" prop="sn">
        <el-input-number v-model="menuForm.sn" />
      </el-form-item>
      <el-form-item label="在菜单中显示" prop="enableMenu">
        <el-select v-model="menuForm.enableMenu">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">取 消</el-button>
      <el-button type="primary" size="small" @click="handleSubmit"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { saveMenu } from "@/api/system";
export default {
  name: "AddMenuDialog",
  data() {
    return {
      visible: false,
      loading: false,
      menuProps: {
        children: "children",
        label: "name",
      },
      menuList: [],
      menuForm: {},
      rule: {
        name: [{ required: true, message: "菜单名称不能为空" }],
        alias: [{ required: true, message: "别名不能为空" }],
        menuUrl: [{ required: true, message: "Url不能为空" }],
        templateUrl: [{ required: true, message: "模板Url不能为空" }],
        sn: [{ required: true, message: "排序不能为空" }],
        enableMenu: [{ required: true, message: "请选择是否在菜单中显示" }],
        parentId: [
          {
            validator: (rule, value, callback) => {
              if (
                this.menuForm.parentId == undefined ||
                this.menuForm.parentId == ""
              ) {
                callback(new Error("请选择父级菜单"));
              }
              callback();
            },
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created() {},
  methods: {
    close() {
      this.$refs.menuForm.resetFields();
      this.visible = false;
    },
    show(info, menuList) {
      if (info) {
        this.menuForm.parentId = info.id;
        this.menuList = menuList;
      }
      this.visible = true;
    },

    getSelectedValue(val) {
      this.menuForm.parentId = val;
    },

    handleSubmit() {
      this.$refs.menuForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          saveMenu(this.menuForm)
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
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
