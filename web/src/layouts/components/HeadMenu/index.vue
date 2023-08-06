<template>
  <div class="menu">
    <el-menu
      :show-timeout="200"
      mode="horizontal"
      router
      :default-active="$route.path"
    >
      <menu-item
        v-for="(route, index) in routers"
        :key="index"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>

<script>
import MenuItem from "./MenuItem";

export default {
  name: "HeadMenu",
  components: { MenuItem },
  props: ["routers"],
};
</script>

<style lang="scss" scoped>
.menu {
  flex: 1;
  width: 0;
}
.el-menu.el-menu--horizontal {
  background-color: rgba(255, 255, 255, 0);
}
/deep/ .el-submenu__icon-arrow {
  display: none;
}
/deep/.el-menu--horizontal > .el-menu-item {
  width: 170px;
  height: 54px;
  line-height: 54px;
  border-bottom: none;
  color: #fff;
  padding-left: 40px;
  svg {
    margin-right: 8px;
  }
  span {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 22px;
  }
}

/deep/.el-menu--horizontal > .el-menu-item.is-active {
  background: url("~@/assets/menu/menu-active.png") no-repeat;
  background-position: center;
  padding-left: 40px;
  svg {
    margin-right: 8px;
  }
  span {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2f68bd;
    line-height: 22px;
  }
}
/deep/.el-menu--horizontal > .el-submenu .el-submenu__title {
  width: 170px;
  height: 54px;
  line-height: 54px;
  color: #fff;
  padding-left: 40px;
  svg {
    margin-right: 8px;
  }
  span {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 22px;
  }
}
/deep/.el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
  background: url("~@/assets/menu/menu-active.png") no-repeat;
  background-position: center;
  padding-left: 40px;
  svg {
    margin-right: 8px;
  }
  span {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2f68bd;
    line-height: 22px;
  }
}

/deep/.el-menu--horizontal > .el-submenu:hover .el-submenu__title {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}
/deep/.el-menu--horizontal > .el-submenu:focus .el-submenu__title {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}

/deep/.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}
/deep/.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover {
  background-color: rgba(255, 255, 255, 0);
  color: #fff;
}
/deep/.el-menu--horizontal > .el-menu--popup {
  padding-left: 0;
  .el-menu-item {
    height: 42px;
    width: 170px;
    background-color: #2f68bd;
    padding-left: 25%;
    span {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #fff;
      line-height: 42px;
    }
  }
  .el-menu-item:hover {
    width: 170px;
    background: url("~@/assets/menu/menu-active.png") no-repeat;
    background-position: center;
    span {
      color: #2f68bd;
    }
  }
}
/deep/.el-menu--horizontal .el-menu--popup {
  width: 20px;
  min-width: 170px !important;
}
/deep/ .el-submenu .el-menu-item {
  min-width: 170px !important;
}
/deep/.el-menu {
  background-color: #2f68bd;
}
</style>
