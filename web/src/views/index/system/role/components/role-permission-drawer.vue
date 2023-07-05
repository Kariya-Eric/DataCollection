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
            :check-strictly="true"
            @node-click="nodeClick"
            highlight-current
            ref="menuTree"
          ></el-tree>
        </el-col>
        <el-col :span="18">
          <el-table
            size="small"
            :data="sysMethodDataSource"
            :border="true"
            :loading="tableLoading"
          >
            <el-table-column type="selection" width="55" align="center">
              <template slot-scope="scope">
                <el-checkbox
                  :value="scope.row.isSelected == '1'"
                  @change="(val) => changeChecked(scope.row, val)"
                />
              </template>
            </el-table-column>
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
  getAllMenuByRoleCode,
  getAllMethodByRoleCode,
  saveRoleAuth,
} from "@/api/system";
export default {
  name: "RolePermissionDrawer",
  data() {
    return {
      visible: false,
      menuList: [],
      menuFilter: "",
      loading: false,
      tableLoading: false,
      menuProps: {
        children: "children",
        label: "name",
      },
      roleInfo: {},
      sysMethodDataSource: [],
      sysMethods: [],
    };
  },
  watch: {
    menuFilter(val) {
      this.$refs.menuTree.filter(val);
    },
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    show(row) {
      this.roleInfo = row;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
    drawerOpen() {
      this.initData();
    },

    initData() {
      this.loading = true;
      this.tableLoading = true;
      getAllMenuByRoleCode(this.roleInfo.code)
        .then((res) => {
          if (res.state) {
            this.menuList = res.value;
            let options = this.renderMenuList(res.value)
              .filter((m) => m.checked == "1")
              .map((m) => m.value);
            this.$refs.menuTree.setCheckedKeys(options);
            getAllMethodByRoleCode(this.roleInfo.code).then((resp) => {
              if (resp.state) {
                this.sysMethods = resp.value;
                this.sysMethodDataSource = resp.value;
              }
            });
          }
        })
        .finally(() => {
          this.loading = false;
          this.tableLoading = true;
        });
    },

    changeChecked(row, val) {
      if (val) {
        this.sysMethods.filter((sys) => sys.id == row.id)[0].isSelected = "1";
      } else {
        this.sysMethods.filter((sys) => sys.id == row.id)[0].isSelected = "0";
      }
    },

    recusiveMenu(menuList, options) {
      menuList.forEach((menu) => {
        options.push({
          label: menu.name,
          value: menu.id,
          checked: menu.checked,
          alias: menu.alias,
        });
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
      let arrMenuAlias = this.$refs.menuTree
        .getCheckedNodes()
        .map((node) => node.alias);
      let arrMethodAlias = this.sysMethods
        .filter((data) => data.isSelected == "1")
        .map((data) => data.alias);
      let param = {
        arrMenuAlias,
        arrMethodAlias,
        roleCode: this.roleInfo.code,
      };
      saveRoleAuth(param).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.initData();
        } else {
          this.$message.error(res.message);
        }
      });
    },

    nodeClick(data) {
      let menu = [data];
      let aliasList = this.renderMenuList(menu).map((menu) => menu.alias);
      let options = [];
      aliasList.forEach((alias) => {
        this.sysMethods.forEach((sys) => {
          if (sys.menuAlias == alias) {
            options.push(sys);
          }
        });
      });
      this.sysMethodDataSource = options;
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
