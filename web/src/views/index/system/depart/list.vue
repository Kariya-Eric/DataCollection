<template>
  <div>
    <page-header-layout title="部门列表">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-card shadow="always" class="app-card">
            <div class="filter-container">
              <div class="search-button-admin">
                <el-button type="primary" size="small" icon="el-icon-plus"
                  >添加组织</el-button
                >
              </div>
            </div>
            <el-input
              placeholder="输入部门名称"
              v-model="departFilter"
              clearable
              size="small"
              prefix-icon="el-icon-search"
            >
            </el-input>
            <el-tree
              class="filter-tree"
              :data="departList"
              :props="departProps"
              :filter-node-method="filterNode"
              ref="departTree"
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-tabs type="border-card" v-model="activeTable">
            <el-tab-pane label="组织信息" name="first">
              <el-empty
                description="请选择部门查看详细信息"
                v-if="departFilter === ''"
              ></el-empty>
            </el-tab-pane>
            <el-tab-pane label="组织人员" name="second">
              <el-empty
                description="请选择部门查看详细信息"
                v-if="departFilter === ''"
              ></el-empty>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </page-header-layout>
  </div>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import { DataCollectionMixin } from "@/mixins/DataCollectionMixins";
export default {
  name: "DepartList",
  mixins: [DataCollectionMixin],
  components: { PageHeaderLayout },
  data() {
    return {
      departProps: {
        children: "children",
        label: "name",
      },
      url: {
        list: "/uc/api/org/v1/org/getOrgTree",
      },
      departList: [],
      departFilter: "",
      activeTable: "first",
    };
  },
  watch: {
    departFilter(val) {
      this.$refs.departTree.filter(val);
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
