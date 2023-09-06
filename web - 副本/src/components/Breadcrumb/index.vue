<template>
  <div>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
          <span v-if="index == breadList.length - 1">{{
            item.meta.title
          }}</span>
          <router-link v-else :to="item.path">{{
            item.meta.title
          }}</router-link>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadList: null,
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      this.breadList = this.$route.matched;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 54px;
  margin-left: 24px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.backbutton {
  float: right;
  margin-top: 14px;
  margin-right: 12px;
}
</style>
