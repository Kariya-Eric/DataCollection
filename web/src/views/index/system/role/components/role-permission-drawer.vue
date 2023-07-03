<template>
  <el-drawer
    :append-to-body="true"
    :visible="visible"
    :show-close="false"
    @opened="drawerOpen"
    size="65%"
  >
    <div slot="title">
      <el-row>
        <el-col :span="12">资源授权</el-col>
        <el-col :span="12">
          <div class="search-button-admin">
            <el-button type="primary" size="small" @click="savePermission"
              >保存</el-button
            >
            <el-button href="javascript:;" @click="close" size="small"
              >返回</el-button
            >
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="mainContent">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="menuFilter"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 12px"
          >
          </el-input>
          <el-tree
            v-loading="loading"
            show-checkbox
            node-key="id"
            class="filter-tree"
            :data="menuList"
            :props="menuProps"
            :filter-node-method="filterNode"
            default-expand-all
            :expand-on-click-node="false"
            highlight-current
            :check-strictly="true"
            @current-change="changeSelect"
            ref="menuTree"
          ></el-tree>
        </el-col>
        <el-col :span="18">
          <el-table :data="sysMethodDataSource" :border="true">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="别名" align="center" prop="alias" />
            <el-table-column label="名称" align="center" prop="name" />
            <el-table-column
              label="请求地址"
              align="center"
              prop="requestUrl"
            />
          </el-table>
        </el-col>
      </el-row>
    </div>
  </el-drawer>
</template>

<script>
import {
  initMenuTree,
  getAllMenuByRoleCode,
  getAllMethodByRoleCode,
} from "@/api/system";
export default {
  name: "RolePermissionDrawer",
  data() {
    return {
      visible: false,
      menuList: [],
      menuFilter: "",
      loading: false,
      menuProps: {
        children: "children",
        label: "name",
      },
      roleInfo: {},
      sysMethodDataSource: [],
    };
  },
  watch: {
    menuFilter(val) {
      this.$refs.menuTree.filter(val);
    },
  },
  created() {
    this.initPermissionList();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    initPermissionList() {
      this.loading = true;
      initMenuTree()
        .then((res) => {
          if (res.state) {
            this.menuList = res.value;
          }
        })
        .finally(() => (this.loading = false));
    },
    show(row) {
      this.roleInfo = row;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    drawerOpen() {
      this.loading = true;
      getAllMenuByRoleCode(this.roleInfo.code)
        .then((res) => {
          if (res.state) {
            let options = this.renderMenuList(res.value).map((m) => m.value);
            this.$refs.menuTree.setCheckedKeys(options);
          }
        })
        .finally(() => (this.loading = false));
    },

    recusiveMenu(menuList, options) {
      menuList.forEach((menu) => {
        options.push({ label: menu.name, value: menu.id });
        if (menu.children && menu.children.length > 0) {
          this.recusiveMenu(menu.children, options);
        }
      });
    },

    renderMenuList(menuList) {
      let options = [];
      this.recusiveMenu(menuList, options);
      return options;
    },

    savePermission() {
      console.log(this.$refs.menuTree.getCheckedKeys());
    },

    changeSelect(data, node) {
      this.sysMethodDataSource = data.sysMethods;
      getAllMethodByRoleCode(this.roleInfo.code).then((res) => {
        if (res.state) {
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  font-weight: bold;
  font-size: 18px;
  letter-spacing: 0ch;
  padding-bottom: 12px;
  border: 1px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
}
.mainContent {
  width: 90%;
  margin: auto;
}
</style>