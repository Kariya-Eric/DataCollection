<template>
  <div class="divider">
    <el-divider :content-position="titlePosition">
      <div :style="dividerStyle">
        {{ title }}
      </div>
    </el-divider>
  </div>
</template>

<script>
export default {
  name: "CustomDivider",
  props: ["title", "titlePosition", "fontSize", "letterSpacing", "color"],
  watch: {
    title(val) {
      this.title = val;
    },
    titlePosition(val) {
      this.titlePosition = val;
    },
  },
  computed: {
    dividerStyle: {
      get() {
        return {
          fontSize: this.fontSize + "px",
          letterSpacing: this.letterSpacing + "em",
          color: this.color,
        };
      },
      set(val) {
        console.log(val);
      },
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-divider {
  margin: 12px 0px;
}
</style>
