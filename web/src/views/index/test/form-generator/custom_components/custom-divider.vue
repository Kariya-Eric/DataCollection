<template>
  <div>
    <div :style="titleStyle">{{ title }}</div>
    <el-divider />
  </div>
</template>

<script>
export default {
  name: "CustomDivider",
  props: ["title", "fontSize"],
  computed: {
    titleStyle() {
      return {
        fontSize: this.fontSize + "px",
        margin: "12px 0 0 24px",
        fontWeight: "bold",
        letterSpacing: "0.15em",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-divider {
  margin: 12px 0;
}
</style>
