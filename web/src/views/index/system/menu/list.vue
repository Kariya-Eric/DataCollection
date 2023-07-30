<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="8">
        <el-card shadow="always" class="app-card">
          <div style="margin-bottom: 12px">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addMenu"
              >添加菜单</el-button
            >
            <el-button
              v-if="JSON.stringify(selectedMenu) != '{}'"
              type="primary"
              size="small"
              icon="el-icon-plus"
              @click="addChildMenu"
              >添加下级菜单</el-button
            >
          </div>
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
            class="filter-tree"
            :data="menuList"
            :props="menuProps"
            :filter-node-method="filterNode"
            default-expand-all
            :expand-on-click-node="false"
            @node-click="nodeClick"
            highlight-current
            ref="menuTree"
          ></el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card
          shadow="always"
          class="app-card"
          v-if="Object.keys(selectedMenu).length === 0"
        >
          <el-empty description="请选择菜单查看详细信息"></el-empty>
        </el-card>
        <el-card v-else>
          <div slot="header" class="cardTitleSlot">
            <span>菜单详情</span>
            <div class="titleButton">
              <el-popconfirm @confirm="delMenu" title="确认要删除该菜单吗？">
                <Mbutton slot="reference" type="danger" name="删除" />
              </el-popconfirm>
              <Mbutton @click="saveMenu" type="primary" name="保存" />
            </div>
          </div>
          <right-menu ref="rightMenu" />
        </el-card>
      </el-col>
    </el-row>
    <add-menu-dialog ref="addMenuDialog" @refresh="initTree" />
  </div>
</template>

<script>
import RightMenu from "./components/right-menu";
import AddMenuDialog from "./components/add-menu-dialog";
import { initMenuTree, saveMenu, delMenu } from "@/api/system";
export default {
  name: "MenuList",
  components: { RightMenu, AddMenuDialog },
  data() {
    return {
      menuProps: {
        children: "children",
        label: "name",
      },
      menuList: [],
      menuFilter: "",
      selectedMenu: {},
      loading: false,
      treeLoading: false,
    };
  },
  watch: {
    menuFilter(val) {
      this.$refs.menuTree.filter(val);
    },
  },
  created() {
    this.initTree();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    initTree() {
      this.treeLoading = true;
      initMenuTree()
        .then((res) => {
          if (res.state) {
            this.menuList = res.value;
          }
        })
        .finally(() => (this.treeLoading = false));
    },

    nodeClick(data, node, _self) {
      this.selectedMenu = data;
      this.$nextTick(() => this.$refs.rightMenu.show(data.id));
    },

    saveMenu() {
      this.$refs.rightMenu.updateMenu().then((res) => {
        if (res) {
          saveMenu(res).then((res) => {
            if (res.state) {
              this.$message.success(res.message);
              this.initTree();
              this.selectedMenu = {};
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },

    addMenu() {
      this.$refs.addMenuDialog.show();
    },

    delMenu() {
      let param = "id=" + this.selectedMenu.id;
      delMenu(param).then((res) => {
        if (res.state) {
          this.$message.success(res.message);
          this.initTree();
          this.selectedMenu = {};
        } else {
          this.$message.error(res.message);
        }
      });
    },

    addChildMenu() {
      this.$refs.addMenuDialog.show(this.selectedMenu, this.menuList);
    },
  },
};
</script>

<style scoped lang="less"></style>
