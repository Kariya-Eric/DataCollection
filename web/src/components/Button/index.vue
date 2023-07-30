<template>
  <el-button size="small" @click="click" :type="type">
    <svg-icon
      v-if="hasIcon"
      style="margin-right: 4px"
      :icon-class="icon"
      width="14px"
      height="14px"
    ></svg-icon>
    {{ name }}
  </el-button>
</template>

<script>
export default {
  props: ["name", "type", "icon"],
  computed: {
    hasIcon() {
      if (this.icon) {
        return true;
      }
      return false;
    },
  },
  methods: {
    click(event) {
      this.$emit("click");
      //清除focus样式
      let target = event.target;
      if (target.nodeName == "SPAN") {
        target = event.target.parentNode;
      }
      target.blur();
    },
  },
};
</script>

<style scoped lang="scss"></style>
