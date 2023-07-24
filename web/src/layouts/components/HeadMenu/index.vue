<template>
  <div class="menu">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      mode="horizontal"
    >
      <div class="menu-item">
        <menu-item
          v-for="route in routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </div>
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
/deep/.el-menu.el-menu--horizontal {
  border-bottom: 0;
  background: url("~@/assets/head/head.png") no-repeat;
}
/deep/.el-submenu__icon-arrow {
  display: none;
}
.menu {
  width: calc(100% - 500px);
}
.menu-item {
  display: flex;
}
/deep/.el-menu-item.is-active {
  background: url("~@/assets/menu/menu-active.png") no-repeat;
  background-position: center;
  svg {
    margin-left: 12px;
  }
  span {
    margin-left: 12px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2f68bd;
    line-height: 22px;
  }
}
/deep/.el-submenu.is-active {
  background: url("~@/assets/menu/menu-active.png") no-repeat;
  background-position: center;
  svg {
    margin-left: 12px;
  }
  span {
    margin-left: 12px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #2f68bd;
    line-height: 22px;
  }
}
/deep/.el-menu-item {
  width: 170px;
  svg {
    margin-left: 12px;
  }
  span {
    margin-left: 12px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
  }
}
/deep/.el-menu-item:hover {
  color: #2f68bd;
}
/deep/.el-submenu__title {
  width: 170px;
  svg {
    margin-left: 12px;
  }
  span {
    margin-left: 12px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
  }
}
</style>
