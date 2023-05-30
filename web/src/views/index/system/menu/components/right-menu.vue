<template>
  <div>
    <el-form
      size="small"
      :inline="true"
      label-width="120px"
      v-loading="loading"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单名称">
            <el-input style="width: 100%" v-model="menuDetail.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="别名">
            <el-input style="width: 100%" v-model="menuDetail.alias" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="URL">
            <el-input style="width: 100%" v-model="menuDetail.menuUrl" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="模板URL">
            <el-input style="width: 100%" v-model="menuDetail.templateUrl" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="图标"> </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input-number style="width: 100%" v-model="menuDetail.sn" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="在菜单中显示">
          <el-select style="width: 100%" v-model="menuDetail.enableMenu">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
    </el-form>
    <el-divider />
    <el-row
      ><span style="margin-left: 12px">功能资源</span
      ><el-button
        size="small"
        type="primary"
        icon="el-icon-plus"
        style="margin-left: 24px"
        @click="addSysMethods"
        >添加</el-button
      ></el-row
    >
    <el-table :data="menuDetail.sysMethods">
      <el-table-column label="别名" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.alias" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="请求方法名" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.name" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="请求地址" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.requestUrl" size="small" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" @click="delRow(scope.row)"
            >删除</el-button
          ></template
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getMenu } from "@/api/system";
import { nanoid } from "nanoid";
export default {
  name: "RightMenu",
  data() {
    return {
      loading: false,
      menuDetail: {},
    };
  },
  methods: {
    show(id) {
      this.loading = true;
      getMenu(id)
        .then((res) => {
          if (res.state) {
            this.menuDetail = res.value;
          }
        })
        .finally(() => (this.loading = false));
    },

    addSysMethods() {
      let sysMethod = {
        id: nanoid(),
        alias: "",
        name: "",
        requestUrl: "",
      };
      if (!this.menuDetail.hasOwnProperty("sysMethods")) {
        this.menuDetail.sysMethods = [];
      }
      this.menuDetail.sysMethods.push(sysMethod);
    },

    delRow(row) {
      this.menuDetail.sysMethods = this.menuDetail.sysMethods.filter(
        (data) => data.id != row.id
      );
    },
  },
};
</script>

<style>
</style>