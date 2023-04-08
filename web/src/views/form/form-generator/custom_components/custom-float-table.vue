<template>
  <div class="floatTable">
    <el-row v-for="item in row" :key="item" type="flex">
      <el-col v-for="item in col" :key="item">
        <div class="inner"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "CustomFloatTable",
  props: {
    conf: {
      // 组件的config 配置
      type: Object,
    },
  },
  watch: {
    conf(val) {
      console.log(val);
    },
  },
  data() {
    return {
      row: this.conf.__config__.row,
      col: this.conf.__config__.col,
    };
  },
};
</script>

<style lang="scss" scoped>
.floatTable {
  .inner {
    border: 1px solid;
    min-height: 36px;
    margin-right: -1px;
    margin-bottom: -1px;
  }
}
</style>