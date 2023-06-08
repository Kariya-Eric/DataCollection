<template>
  <div class="page-header">
    <el-tabs v-model="activePage" style="margin-left: 240px; margin-top: -4px">
      <el-tab-pane
        v-for="page in pageList"
        :key="page.fullPath"
        :name="page.fullPath"
        :lazy="true"
      >
        <span slot="label"
          >{{ page.meta.title
          }}<i
            v-show="page.meta.title != '首页'"
            class="el-icon-close"
            @click.stop="removeTab(page.fullPath)"
            style="margin-left: 12px"
          ></i
        ></span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  created() {
    if (this.$route.path != "/dashboard/workplace") {
      this.addIndexToFirst();
    }
    let currentRoute = Object.assign({}, this.$route);
    currentRoute.meta = Object.assign({}, currentRoute.meta);
    this.pageList.push(currentRoute);
    this.linkList.push(currentRoute.fullPath);
    this.activePage = currentRoute.fullPath;
  },
  watch: {
    $route: function (newRoute) {
      this.activePage = newRoute.fullPath;
      if (this.linkList.indexOf(newRoute.fullPath) < 0) {
        this.linkList.push(newRoute.fullPath);
        this.pageList.push(Object.assign({}, newRoute));
      } else if (this.linkList.indexOf(newRoute.fullPath) >= 0) {
        let oldIndex = this.linkList.indexOf(newRoute.fullPath);
        let oldPositionRoute = this.pageList[oldIndex];
        this.pageList.splice(
          oldIndex,
          1,
          Object.assign({}, newRoute, { meta: oldPositionRoute.meta })
        );
      }
    },

    activePage: function (key) {
      let index = this.linkList.lastIndexOf(key);
      let waitRouter = this.pageList[index];
      this.$router.push(Object.assign({}, waitRouter));
      if (waitRouter.fullPath !== this.$route.fullPath) {
        this.$router.push(Object.assign({}, waitRouter));
      }
    },
  },
  data() {
    return {
      pageList: [],
      linkList: [],
      activePage: "",
    };
  },
  methods: {
    removeTab(key) {
      this.pageList = this.pageList.filter((item) => item.fullPath !== key);
      let index = this.linkList.indexOf(key);
      this.linkList = this.linkList.filter((item) => item !== key);
      index = index >= this.linkList.length ? this.linkList.length - 1 : index;
      this.activePage = this.linkList[index];
    },
    addIndexToFirst() {
      this.pageList.splice(0, 0, {
        name: "WorkPlace",
        path: "/dashboard/workplace",
        fullPath: "/dashboard/workplace",
        meta: {
          title: "首页",
        },
      });
      this.linkList.splice(0, 0, "/dashboard/workplace");
    },
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  height: 52px;
  padding: 16px 32px 0px;
  border-bottom: 1px solid #e8e8e8;
}
</style>
