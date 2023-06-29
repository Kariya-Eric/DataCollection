<template>
  <el-dialog :visible="visible" title="添加菜单" @close="close" width="40%">
    <el-form
      ref="menuForm"
      :model="menuForm"
      label-width="120px"
      :rules="rule"
      size="small"
    >
      <el-form-item label="菜单名称" prop="name"
        ><el-input v-model="menuForm.name"
      /></el-form-item>
      <el-form-item
        label="父级菜单"
        v-if="menuForm.parentId != undefined"
        prop="parentId"
      >
        <el-select v-model="menuForm.parentId" style="width: 100%">
          <el-option
            v-for="item in renderMenuList(menuList)"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            style="display: none"
          />
          <el-tree
            node-key="id"
            :data="menuList"
            :props="menuProps"
            default-expand-all
            @node-click="nodeClick"
            :current-node-key="menuForm.parentId"
            highlight-current
            ref="menuTree"
          ></el-tree>
        </el-select>
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
      <el-form-item label="图标"></el-form-item>
      <el-form-item label="排序" prop="sn">
        <el-input-number v-model="menuForm.sn" />
      </el-form-item>
      <el-form-item label="在菜单中显示">
        <el-select v-model="menuForm.enableMenu" prop="enableMenu">
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "AddMenuDialog",
  data() {
    return {
      visible: false,
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
        console.log(this.menuList);
      }
      this.visible = true;
    },

    nodeClick(node) {
      this.menuForm.parentId = node.id;
    },

    renderMenuList(menuList) {
      let options = [];
      this.recusiveMenu(menuList, options);
      return options;
    },

    recusiveMenu(menuList, options) {
      menuList.forEach((menu) => {
        options.push({ label: menu.name, value: menu.id });
        if (menu.children && menu.children.length > 0) {
          this.recusiveMenu(menu.children, options);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
