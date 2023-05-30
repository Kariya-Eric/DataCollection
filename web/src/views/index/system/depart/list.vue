<template>
  <div>
    <page-header-layout title="部门列表">
      <el-row :gutter="24">
        <el-col :span="10">
          <el-card shadow="always" class="app-card">
            <div class="filter-container">
              <div class="search-button-admin">
                <el-button type="primary" size="small" icon="el-icon-plus"
                  >添加组织</el-button
                >
                <el-button type="primary" size="small" icon="el-icon-plus"
                  >添加下级</el-button
                >
              </div>
            </div>
            <el-input
              placeholder="输入部门名称"
              v-model="departFilter"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 12px"
            >
            </el-input>
            <el-tree
              class="filter-tree"
              :data="departList"
              :props="departProps"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              ref="departTree"
            ></el-tree>
          </el-card>
        </el-col>
        <el-col :span="14">
          <el-tabs type="border-card" v-model="activeTable">
            <el-tab-pane label="组织信息" name="first">
              <el-empty
                description="请选择部门查看详细信息"
                v-if="Object.keys(selectedDept).length === 0"
              />
              <div v-else class="mainform">
                <el-form
                  label-width="120px"
                  v-model="departForm"
                  ref="departForm"
                  v-loading="loading"
                >
                  <el-form-item label="上级部门">
                    <el-select
                      v-model="departForm.parentId"
                      style="width: 100%"
                    ></el-select>
                  </el-form-item>
                  <el-form-item label="部门名称">
                    <el-input v-model="departForm.name" />
                  </el-form-item>
                  <el-form-item label="部门编码">
                    <el-input v-model="departForm.code" disabled />
                  </el-form-item>
                  <el-form-item label="排序">
                    <el-input-number :min="0" />
                  </el-form-item>
                  <el-form-item label="职能类型">
                    <el-select
                      v-model="departForm.type"
                      style="width: 100%"
                    ></el-select>
                  </el-form-item>
                  <el-form-item label="负责人">
                    <el-select
                      v-model="departForm.directorId"
                      style="width: 100%"
                    ></el-select>
                  </el-form-item>
                  <el-form-item label="联系人">
                    <el-select
                      v-model="departForm.contacts"
                      style="width: 100%"
                    ></el-select>
                  </el-form-item>
                  <el-form-item label="状态">
                    <el-switch
                      v-model="departForm.status"
                      :inactive-value="0"
                      :active-value="1"
                    />
                  </el-form-item>
                  <div class="formButton">
                    <el-button icon="el-icon-refresh" size="small"
                      >重置</el-button
                    >
                    <el-button type="primary" icon="el-icon-edit" size="small"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
            <el-tab-pane label="组织人员" name="second">
              <el-empty
                description="请选择部门查看详细信息"
                v-if="Object.keys(selectedDept).length === 0"
              />
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </page-header-layout>
  </div>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
import Vue from "vue";
import { USER_INFO } from "@/store/mutation-types";
import { initDeptTree } from "@/api/system";
export default {
  name: "DepartList",
  components: { PageHeaderLayout },
  data() {
    return {
      departProps: {
        children: "children",
        label: "name",
      },
      departList: [],
      departFilter: "",
      activeTable: "first",
      departForm: {},
      selectedDept: {},
      loading: false,
    };
  },
  watch: {
    departFilter(val) {
      this.$refs.departTree.filter(val);
    },
  },
  created() {
    this.initDepart();
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    initDepart() {
      let userInfo = Vue.ls.get(USER_INFO);
      initDeptTree(userInfo.userId).then((res) => {
        if (res.state) {
          this.departList = res.value;
        }
      });
    },

    nodeClick(data, node, _self) {
      this.selectedDept = data;
    },
  },
};
</script>

<style scoped lang="scss">
.mainform {
  width: 85%;
  margin: auto;
  margin-top: 24px;
  margin-bottom: 24px;
}
.formButton {
  text-align: center;
}
</style>
