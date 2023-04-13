<template>
  <div>
    <page-header-layout title="菜单列表">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card shadow="always" class="app-card">
            <div class="filter-container">
              <div class="search-button-admin">
                <el-button type="primary" size="small" icon="el-icon-plus"
                  >添加菜单</el-button
                >
              </div>
            </div>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="menuFilter"
              clearable
              size="small"
              prefix-icon="el-icon-search"
            >
            </el-input>
            <el-tree
              class="filter-tree"
              :data="menuList"
              :props="menuProps"
              :filter-node-method="filterNode"
              ref="menuTree"
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card shadow="always" class="app-card">
            <el-empty
              description="请选择菜单查看详细信息"
              v-if="menuFilter === ''"
            ></el-empty>
          </el-card>
        </el-col>
      </el-row>
    </page-header-layout>
  </div>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
export default {
  name: "MenuList",
  mixins: [DataCollectionMixin],
  components: { PageHeaderLayout },
  data() {
    return {
      menuProps: {
        children: "children",
        label: "name",
      },
      url: {
        list: "/portal/sysMenu/getTree",
      },
      menuList: [],
      menuFilter: "",
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
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped lang="less"></style>
