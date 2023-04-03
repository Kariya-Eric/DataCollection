<template>
  <page-header-layout title="高级表单">
    <div slot="headerContent" style="padding-bottom: 10px;">
      <div>
        <span>
          高级表单常见于一次性输入和提交大批量数据的场景。
        </span>
      </div>
    </div>
    <el-card shadow="always" class="app-card" header="仓库管理">
      <repository-form ref="repositoryForm"></repository-form>
    </el-card>
    <el-card shadow="always" class="app-card" header="任务管理">
      <task-form ref="taskForm"></task-form>
    </el-card>
    <el-card shadow="always" class="app-card">
      <!-- Table Start -->
      <el-table
        ref="multipleTable"
        :key="tableKey"
        v-loading="isLoading"
        :data="listData"
        style="width: 100%;"
        size="medium"
        fit
      >
        <el-table-column label="成员姓名" prop="name"> </el-table-column>
        <el-table-column label="工号" prop="workId"> </el-table-column>
        <el-table-column label="所属部门" prop="department"> </el-table-column>

        <el-table-column width="150">
          <template v-slot="scope">
            <el-button type="text">编辑</el-button>
            <el-dropdown trigger="click">
              <span class="link-type">
                更多
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <template v-slot:dropdown>
                <el-dropdown-menu style="text-align: center;">
                  <el-dropdown-item>查看</el-dropdown-item>
                  <el-dropdown-item divided>删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- Table End-->
      <div style="margin-top: 24px;">
        <el-button
          style="width: 100%; border-style: dashed;"
          icon="el-icon-plus"
          size="small"
          >添加</el-button
        >
      </div>
    </el-card>
  </page-header-layout>
</template>

<script>
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import RepositoryForm from './repositoryform';
import TaskForm from './taskform';

const data = [
  {
    key: '1',
    name: '小明',
    workId: '001',
    editable: false,
    department: '行政部'
  },
  {
    key: '2',
    name: '李莉',
    workId: '002',
    editable: false,
    department: 'IT部'
  },
  {
    key: '3',
    name: '王小帅',
    workId: '003',
    editable: false,
    department: '财务部'
  }
];

export default {
  components: {
    PageHeaderLayout,
    RepositoryForm,
    TaskForm
  },
  data() {
    return {
      listData: data,
      isLoading: false,
      tableKey: 0
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
