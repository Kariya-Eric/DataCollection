<template>
  <div>
    <page-header-layout>
      <el-card shadow="always" class="app-card">
        <el-row>
          <el-col :span="6">
            <el-card class="box-card" @click.native="clickFirst">
              <router-link :to="{ path: '/task/list' }">
                <el-result title="本科教学状态数据分析报告"></el-result>
              </router-link>
            </el-card>
          </el-col>
          <el-col :span="6" style="margin-left: 24px">
            <el-card class="box-card" @click.native="clickSecond">
              <el-result title="本科教学质量报告"></el-result>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </page-header-layout>
  </div>
</template>

<script>
import PageHeaderLayout from "layouts/PageHeaderLayout";
export default {
  name: "AnalyzeList",
  components: { PageHeaderLayout },
  data() {
    return {};
  },
  methods: {
    clickFirst() {
      console.log("first");
    },

    clickSecond() {
      console.log("second");
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  cursor: pointer;
}
.app-card {
  height: 780px;
}
</style>